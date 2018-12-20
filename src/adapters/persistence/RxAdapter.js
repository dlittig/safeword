import PersistenceAdapter from './PersistenceAdapter'

import { store } from '../../store'
import { passwordSchema, groupSchema } from './schema'
import { arrayHasObject, getKeyOfObjectInArray } from '../../utils'
import { Setup as SetupAction } from '../../store/actions/Setup'
import globals from '../../globals'
import Group from '../../model/Group'
import Password from '../../model/Password'
import RxDB from 'rxdb'
import schemas from './schema'
import FileSystemItem from '../../modules/filesystem/FileSystemItem'
import { DIRECTORY_PREFIX } from '../../components/core/Sync/parameters'

export default class RxAdapter extends PersistenceAdapter {
  db = null
  adapter = ''

  static description = 'Rx'

  describe = () => 'Rx'

  /**
   * Private function that prepares all adapters by applying them to Rx
   */
  _setAdapter = () => {
    // Create config and require plugins. Is neccessary to do here because otherwise initialization happens to early
    if(globals.PLATFORM === 'desktop') {
      RxDB.plugin(require('pouchdb-adapter-idb'))
      this.adapter = 'idb'
    } else if(globals.PLATFORM === 'mobile') {
      RxDB.plugin(require('pouchdb-adapter-asyncstorage').default)
      this.adapter = 'asyncstorage'
    }
  }

  /**
   * Creates the adapter, so it is ready for use
   * @param  {Object} props Object containing needed properties for setup
   * @param  {String} password Password as string to setup password protected storage
   * @returns Promise
   */
  create = (props, password) => new Promise(async (resolve, reject) => {
    if(this.db !== null) {
      return resolve(this.db.passwords !== undefined && this.db.groups !== undefined)
    }

    // Create config and require plugins. Is neccessary to do here because otherwise initialization happens to early
    if(this.adapter === '')
      this._setAdapter()

    const rx = {
      name: 'data',
      adapter: this.adapter,
      multiInstance: false,
      password: password
    }

    //this.db = await RxDB.create(rx)
    RxDB.create(rx).then(async db => {
      this.db = db

      let passwordCollection = null
      let groupCollection = null

      passwordCollection = await this.db.collection({
        name: 'passwords',
        schema: passwordSchema
      }).catch(err => this.db.passwords)

      groupCollection = await this.db.collection({
        name: 'groups',
        schema: groupSchema
      }).catch(err => this.db.groups)

      if(passwordCollection !== undefined && groupCollection !== undefined) {
        resolve(true)
      } else {
        store.dispatch(SetupAction.error('Something went wrong during the Setup of Rx.'))
        resolve(false)
      }
    }).catch(e => console.error(e))
  })

  /**
   * Unlocks the adapter so the adapter can be used
   * @param  {String} password Password used to decrypt the data
   * @param  {Object} config Config instance
   */
  unlock = async (password, config) => {
    if(this.db === null) {
      if(this.adapter === '')
        this._setAdapter()

      const rx = {
        name: 'data',
        adapter: this.adapter,
        multiInstance: false,
        password
      }

      // Recreate database
      return RxDB.create(rx).then(async db => {
        this.db = db

        let passwordCollection = null
        let groupCollection = null

        passwordCollection = await this.db.collection({
          name: 'passwords',
          password,
          schema: passwordSchema
        }).catch(err => {
          return this.db.passwords
        })

        groupCollection = await this.db.collection({
          name: 'groups',
          password,
          schema: groupSchema
        }).catch(err => this.db.groups)

        if(passwordCollection !== undefined && groupCollection !== undefined) {
          return true
        } else {
          store.dispatch(SetupAction.error('Something went wrong during unlock of Rx.'))
          return false
        }
      })
    }
  }

  /**
   * Destroys current Adapter instance to prevent data access
   */
  destroy = async () => {
    await this.db.destroy()
    this.db = null
    return true
  }

  /**
   * Removes all traces of the adapter like the app was freshly installed
   */
  clean = () => {
    if(this.adapter === '')
      this._setAdapter()

    return RxDB.removeDatabase('data', this.adapter).then(result => true).catch(err => false)
  }

  /**
   * Rebuilds adapter with new data. Old database instance is being destroyed and a new instance is being created
   * containing the dumped data
   * @param  {String} key The new key of the secured store
   * @param  {Object} dump The data to read into the newly encrypted storage
   */
  rebuild = async (key, dump = null) => {
    if(dump === null)
      dump = await this.db.dump()

    await this.destroy()
    await this.clean()
    this.db = null
    await this.create(null, key)
    this.db.importDump(dump)

    return true
  }

  /**
   * Reads all passwords from storage and hydrates the redux store
   */
  hydratePasswords = async () => {
    // Get all passwords
    const result = await this.db.passwords.find().exec()
    console.log('result', result)
    result.map(async element => {
      const password = new Password(
        parseInt(element.id),
        element.name,
        element.username,
        element.password,
        element.notes,
        new Group(),
        element.used,
        element.validTill
      )

      // Add group to store if not exist
      const rxGroup = await element.populate('group')
      console.log('rxGroup', rxGroup)

      if(rxGroup !== null && element.group !== '') {
        // If group was already hydrated, add password to existing group
        const group = arrayHasObject(store.getState().persistence.groups, 'name', rxGroup.name)

        // Group was created, add references
        if(group !== null) {
          password.group = group
          group.passwords.push(password)
        } else {
          // Group was not created before
          const newGroup = new Group(rxGroup.id.toString(), rxGroup.name)
          newGroup.passwords.push(password)
          password.group = newGroup
          this.addGroupToState(newGroup)
        }
      }

      this.addPasswordToState(password)
    })
  }

  /**
   * Checks if there is a collision
   * @param {Object} password Password instance featuring all the changes
   * @param {Object} oldPassword Instance of old password
   * @param {Object} group Group instance
   * @param {String} type 'edit' or 'new'
   * @returns True of collision was detected, false otherwise
   */
  collides = async (password, oldPassword, group, type) => false

  /**
   * Checks if password exists with that group exists already
   * @param {Object} password Password instance with changes
   * @param {Object} group Group instance
   * @returns True if file already exists, false otherwise
   */
  exists = async (password, group) => false


  /**
   * Adds the password instance to the secured storage of the adapter
   * @param {Object} password The new password instance
   * @returns Returns the created password
   */
  addPassword = password => {
    this.db.passwords.insert({
      id: password.id.toString(),
      name: password.name,
      username: password.username,
      password: password.password,
      notes: password.notes,
      group: (password.hasGroup()) ? password.group.id.toString() : null,
      used: password.used,
      validTill: password.validTill
    })

    this.addPasswordToState(password)

    if(password.hasGroup()) {
      // Get group and add password to it
      const groups = store.getState().persistence.groups
      const object = arrayHasObject(groups, 'name', password.group.name)
      if(object !== null) {
        object.passwords.push(password)
        this.updateGroupInState(object, 'name')
      }
    }

    return password
  }

  /**
   * Updates the password instance in the adapter
   * @param  {Object} password New password instance
   * @param  {Object} oldPassword Old password instance used to identifiy the password entity to update
   */
  updatePassword = async (password, oldPassword) => {
    await this.db.passwords.upsert({
      id: password.id.toString(),
      name: password.name,
      username: password.username,
      password: password.password,
      notes: password.notes,
      group: (password.hasGroup()) ? password.group.id : null,
      used: password.used,
      validTill: password.validTill
    })

    this.updatePasswordInState(password, 'id')
    // Add password to group array and remove from old group
    if(password.group.name !== oldPassword.group.name) {
      const groups = store.getState().persistence.groups
      const oldGroup = arrayHasObject(groups, 'name', oldPassword.group.name)

      if(password.group.name !== '') {
        const newGroup = arrayHasObject(groups, 'name', password.group.name)
        newGroup.passwords.push(password)
        this.updateGroupInState(newGroup, 'name')
      }

      if(oldPassword.group.name !== '') {
        oldGroup.passwords.splice(getKeyOfObjectInArray(oldGroup.passwords, 'id', password.id), 1)
        this.updateGroupInState(oldGroup, 'name')
      }
    }
  }

  /**
   * Removes the password from storage
   * @param {Object} password Password entity to remove from storage
   */
  deletePassword = password => {
    this.db.passwords.findOne().where('id').eq(password.id.toString()).exec()
      .then(password => password.remove())
      .then(res => {
        this.deletePasswordFromState(password)
        password = null
      })
  }

  /**
   * Reads all groups from the storage and hydrates the redux store
   */
  hydrateGroups = async () => {
    // Get all groups that havent been added in password hydration step
    const result = await this.db.groups.find().exec()
    console.log(result)
    result.map(rxGroup => {
      const object = arrayHasObject(store.getState().persistence.groups, 'name', rxGroup.name)
      if(object === null) {
        this.addGroupToState(new Group(rxGroup.id, rxGroup.name))
      }
    })
  }

  /**
   * Adds group to storage
   * @param {Object} group Group instance to be added
   */
  addGroup = async group => {
    // Only add group if it does not exist
    const object = arrayHasObject(store.getState().persistence.groups, 'name', group.name)
    if(object === null) {
      await this.db.groups.insert({
        id: group.id.toString(),
        name: group.name,
        passwords: []
      })

      this.addGroupToState(group)
    }

    return group
  }

  /**
   * Updates the name of the group in the storage
   * @param  {Object} group The group that needs to be changed
   * @param  {String} newName The new name of the group
   */
  updateGroup = async (group, newName) => {
    this.db.groups.upsert({
      id: group.id.toString(),
      name: newName
    }).then(() => this.updateGroupInState(group, 'name'))
  }

  /**
   * Removes the group from storage
   * @param {Object} group The group to be removed
   */
  deleteGroup = async group => {
    console.log(group)
    this.db.groups.findOne().where('id').eq(group.id.toString()).exec()
      .then(group => group.remove())
      .then(res => {
        this.deleteGroupFromState(group)
        group = null
      })
  }

  /**
   * Collect files that should be pushed to sync adapter
   * @param {Object} object Contains the path of all files in case all=true. Otherweise it contains the model of file or dir
   * @param {Boolean} all Flag if all data of a dir should be collected or just a single file
   * @param {String} type Can contain 'file' or 'dir' whether it is a file or not
   * @returns Map with FileSystemItems
   */
  collectFilesForPushSync = async (object, all = false, type) => {
    //if(all) {
    const result = new Map()
    const dump = await this.db.dump()
    const json = JSON.stringify(dump)
    console.dir(dump)
    result.set(new FileSystemItem('rx.dump', `${DIRECTORY_PREFIX}/rx.dump`, false, 1), json)

    return result
    //}
  }

  /**
   * Collects additional files that should be synced, like keys used by an adapter.
   * @returns Map with FileSystemItems
   */
  collectAdditionalFilesForPushSync = async () => new Map()

  /**
   * Processes all password files that have been pulled from the remote server during sync.
   * @param  {Map} map Map containing FileSystemItems with files from remote server
   * @param  {Boolean} all=false True if all data should be pulled
   * @param  {String} password
   * @returns Promise which resolves to true when sync successfully finished. Resolves to false otherwise
   */
  processFilesOfPullSync = (map, all = false, password) => new Promise(async (resolve, reject) => {
    for (let [key, value] of map) {
      if(key.name === 'rx.dump') {
        const object = JSON.parse(value)
        // Remove collections
        await this.db.passwords.remove()
        await this.db.groups.remove()
        await this.destroy()
        await this.clean()
        this.db = null
        await this.create(null, password)
        const result = await this.db.importDump(object).then(() => true).catch(err => false)
        resolve(result)
      }
    }

    if(map.length === 0) resolve(false)
  })

  /**
   * Processes all additional files that have been pulled from the web storage during sync.
   * @param {Map} map Map with FileSystemItems
   * @returns If operation was successful
   */
  processAdditionalFilesOfPullSync = async map => true
}
