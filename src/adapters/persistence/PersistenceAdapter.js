import { store } from '../../store'
import { Persistence } from '../../store/actions/Persistence'
import { getKeyOfObjectInArray, arrayHasObject } from '../../utils'
import Group from '../../model/Group'

export default class PersistenceAdapter {

  /**
   * Creates the adapter, so it is ready for use
   * @param  {Object} props Object containing needed properties for setup
   * @param  {String} password Password as string to setup password protected storage
   * @returns Promise
   */
  create = (props, password) => new Promise((resolve, reject) => {})

  /**
   * Describes the adapter by returning a unique identifier
   * @returns String with identifier
   */
  describe = () => null

  /**
   * Unlocks the adapter so the adapter can be used
   * @param  {String} password Password used to decrypt the data
   * @param  {Object} config Config instance
   */
  unlock = (password, config) => {}

  /**
   * Destroys current Adapter instance to prevent data access
   */
  destroy = async () => {}

  /**
   * Removes all traces of the adapter like the app was freshly installed
   */
  clean = async () => {}

  /**
   * Rebuilds adapter with new data. This might be needed if the credential data changes when syncing.
   * @param  {String} key The new key of the secured store
   * @param  {Object} dump The data to read into the newly encrypted storage
   */
  rebuild = async (key, dump) => null

  /**
   * Adds the password instance to the secured storage of the adapter
   * @param {Object} password The new password instance
   * @returns Returns the created password
   */
  addPassword = async password => null

  /**
   * Updates the password instance in the adapter
   * @param  {Object} password New password instance
   * @param  {Object} oldPassword Old password instance used to identifiy the password entity to update
   */
  updatePassword = async (password, oldPassword) => {}

  /**
   * Removes the password from storage
   * @param {Object} password Password entity to remove from storage
   */
  deletePassword = async password => {}

  /**
   * Adds group to storage
   * @param {Object} group Group instance to be added
   */
  addGroup = async group => {}

  /**
   * Updates the name of the group in the storage
   * @param  {Object} group The group that needs to be changed
   * @param  {String} newName The new name of the group
   */
  updateGroup = (group, newName) => {}

  /**
   * Removes the group from storage
   * @param {Object} group The group to be removed
   */
  deleteGroup = group => {}

  /**
   * Reads all passwords from storage and hydrates the redux store
   */
  hydratePasswords = async () => {}

  /**
   * Reads all groups from the storage and hydrates the redux store
   */
  hydrateGroups = async () => {}

  /**
   * Adds password to state. Normally the functions that alter the state dont need to be
   * overriden by a subclass.
   * @param {Object} password Password instance that was added to the storage
   * @returns Returns added password
   */
  addPasswordToState = password => {
    const passwords = []
    passwords.push(...store.getState().persistence.passwords, password)
    store.dispatch(Persistence.updatePasswords(passwords))

    return password
  }

  /**
   * Cleares the password state by setting an empty array.
   */
  cleanPasswordState = () => store.dispatch(Persistence.updatePasswords([]))

  /**
   * Adds group to state
   * @param {Object} group The new group instance
   * @returns Returns the created group
   */
  addGroupToState = group => {
    const groups = []
    groups.push(...store.getState().persistence.groups, group)
    store.dispatch(Persistence.updateGroups(groups))

    return group
  }

  /**
   * Cleares the group state by setting an empty array
   */
  cleanGroupState = () => store.dispatch(Persistence.updateGroups([]))

  /**
   * Updates a password in the state
   * @param  {Object} password Password instance to update
   * @param  {String} key Key of object that identifies the selected instance
   */
  updatePasswordInState = (password, key) => {
    const passwords = [...store.getState().persistence.passwords]
    const object = arrayHasObject(passwords, key, password[key])
    object.name = password.name
    object.username = password.username
    object.password = password.password
    object.group = password.group
    object.notes = password.notes
    object.used = password.used
    object.validTill = password.validTill
    store.dispatch(Persistence.updatePasswords(passwords))
  }

  /**
   * Updates a grouü in the state
   * @param  {Object} group Group instance that should be updated
   * @param  {String} key Key of object that identifies the selected instance
   */
  updateGroupInState = (group, key) => {
    const groups = [...store.getState().persistence.groups]
    const object = arrayHasObject(groups, key, group[key])
    const oldName = `${object.name}`
    object.name = group.name
    object.passwords = group.passwords

    store.getState().persistence.passwords.map(item => {
      if(item.group.name === oldName)
        item.group.name = group.name
    })
    store.dispatch(Persistence.updateGroups(groups))
  }

  /**
   * Removes a password from redux store
   * @param {Object} password Password that should be removed
   */
  deletePasswordFromState = password => {
    // Remove passwords from groups
    const groups = [...store.getState().persistence.groups]
    groups.map(group => {
      group.passwords.splice(getKeyOfObjectInArray(group.passwords, 'id', password.id), 1)
    })
    store.dispatch(Persistence.updateGroups(groups))

    const passwords = [...store.getState().persistence.passwords]
    let toRemove = passwords.splice(getKeyOfObjectInArray(passwords, 'id', password.id), 1)
    toRemove = null // Make sure content is deleted
    store.dispatch(Persistence.updatePasswords(passwords))
  }

  /**
   * Removes a password from redux store
   * @param {Object} group Group that should be removed
   */
  deleteGroupFromState = group => {
    // Remove group from password
    const passwords = [...store.getState().persistence.passwords]
    passwords.map(password => {
      if(password.group.name === group.name) {
        password.group = new Group()
      }
    })
    store.dispatch(Persistence.updatePasswords(passwords))

    const groups = [...store.getState().persistence.groups]
    let toRemove = groups.splice(getKeyOfObjectInArray(groups, 'name', group.name), 1)
    toRemove = null // Make sure content is deleted
    store.dispatch(Persistence.updateGroups(groups))
  }

  /**
   * Collect files that should be pushed to sync adapter
   * @param {Object} object Contains the path of all files in case all=true. Otherweise it contains the model of file or dir
   * @param {Boolean} all Flag if all data of a dir should be collected or just a single file
   * @param {String} type Can contain 'file' or 'dir' whether it is a file or not
   * @returns Map with FileSystemItems
   */
  collectFilesForPushSync = async (object, all = false, type) => new Map()

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
  processFilesOfPullSync = (map, all = false, password) => new Promise(async (resolve, reject) => {})

  /**
   * Processes all additional files that have been pulled from the web storage during sync.
   * @param {Map} map Map with FileSystemItems
   * @returns If operation was successful
   */
  processAdditionalFilesOfPullSync = async map => true
}
