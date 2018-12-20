'use strict';

import PersistenceAdapter from './PersistenceAdapter'

import fs from '../../modules/filesystem'
import Keystore from '../../modules/keystore'
import globals from '../../globals'
import Group from '../../model/Group'
import Password from '../../model/Password'
import { store } from '../../store'
import { isObjectEmpty, arrayHasObject, nameToFileName, getKeyOfObjectInArray, fsToMap } from '../../utils'
import openpgp from '../../modules/openpgp'
import { Setup as SetupAction } from '../../store/actions/Setup'
import FileSystemItem from '../../modules/filesystem/FileSystemItem'
import { DIRECTORY_PREFIX } from '../../components/core/Sync/parameters'
// Dont remove!
import sjcl from 'sjcl'

export default class OpenpgpAdapter extends PersistenceAdapter {

  static description = 'OpenPGP'

  /**
   * @returns Unique identifier of adapter
   */
  describe = () => 'OpenPGP'

  /**
   * Creates the adapter, so it is ready for use
   * @param  {Object} props Object containing needed properties for setup
   * @param  {String} password Password as string to setup password protected storage
   * @returns Promise
   */
  create = (props, password) => new Promise((resolve, reject) => {
    console.log(password, 'create')

    // Create files in specified directory
    const {filePath} = props

    // TODO: find good defaults
    const options = {
      userIds: [{ name:'Jon Smith', email:'jon@example.com' }], // multiple user IDs
      //numBits: 4096,                                            // RSA key size
      //curve: 'p256',
      curve: 'brainpoolP256r1',
      passphrase: password                                      // protects the private key
    }

    openpgp.generateKey(options).then(function(key) {
      const privkey = key.privateKeyArmored // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
      const pubkey = key.publicKeyArmored   // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
      const revocationSignature = key.revocationSignature // '-----BEGIN PGP PUBLIC KEY BLOCK ... '

      fs.createFile(`${filePath}/private.key`, privkey)
        .then(() => {
          fs.createFile(`${filePath}/public.key`, pubkey)
            .then(() => resolve(true))
            .catch(() => {
              store.dispatch(SetupAction.error('Public file could not be written.'))
              reject(false)
            })
        })
        .catch(() => {
          store.dispatch(SetupAction.error('Private file could not be written.'))
          reject(false)
        })
    }).catch(error => reject(false))
  })

  /**
   * Unlocks the adapter so the adapter can be used
   * @param  {String} password Password used to decrypt the data
   * @param  {Object} safeword Config instance
   */
  unlock = async (password, safeword) => {
    const encryptedPrivateKey = await fs.readFile(`${safeword.path}/private.key`)
    const privKeyObj = (await openpgp.key.readArmored(encryptedPrivateKey)).keys[0]
    console.log(encryptedPrivateKey, await openpgp.key.readArmored(encryptedPrivateKey))

    return await privKeyObj.decrypt(password)
  }

  /**
   * Destroys current Adapter instance to prevent data access
   */
  destroy = async () => true

  /**
   * Removes all traces of the adapter like the app was freshly installed
   */
  clean = async () => true

  /**
   * Rebuilds adapter with new data. This might be needed if the credential data changes when syncing.
   * @param  {String} key The new key of the secured store
   * @param  {Object} dump The data to read into the newly encrypted storage
   */
  rebuild = async (key, dump) => true

  /**
   * Encrypts the data with openpgp
   * @param {String} text Text the adapter should encrypt
   */
  encrypt = async text => {
    const configuration = await store.getState().config.store.get()
    const encryptedPrivateKey = await fs.readFile(`${configuration.path}/private.key`)
    const privKeyObj = (await openpgp.key.readArmored(encryptedPrivateKey)).keys[0]
    const pubkey = await fs.readFile(`${configuration.path}/public.key`)
    console.log(pubkey, await openpgp.key.readArmored(pubkey))

    // Decrypt private key with password from keystore
    const password = await Keystore.get('safeword')
    await privKeyObj.decrypt(password)

    const options = {
      data: openpgp.message.fromText(text),
      message: openpgp.message.fromText(text),       // input as Message object
      publicKeys: (await openpgp.key.readArmored(pubkey)).keys, // for encryption
      privateKeys: [privKeyObj]                                 // for signing (optional)
    }

    return openpgp.encrypt(options).then(ciphertext => {
      const encrypted = ciphertext.data // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
      return encrypted
    })
  }

  /**
   * Decrypts the data with openpgp
   * @param {String} text Text the adapter should decrypt
   */
  decrypt = async text => {
    const configuration = await store.getState().config.store.get()
    const encryptedPrivateKey = await fs.readFile(`${configuration.path}/private.key`)
    const privKeyObj = (await openpgp.key.readArmored(encryptedPrivateKey)).keys[0]
    const pubkey = await fs.readFile(`${configuration.path}/public.key`)

    const password = await Keystore.get('safeword')
    await privKeyObj.decrypt(password)

    const content = await openpgp.message.readArmored(text)
    const options = {
      data: content,
      message: content,    // parse armored message
      publicKeys: (await openpgp.key.readArmored(pubkey)).keys, // for verification (optional)
      privateKeys: [privKeyObj]                                 // for decryption
    }

    return openpgp.decrypt(options).then(plaintext => {
      return plaintext.data // 'Hello, World!'
    })
  }

  /**
   * Reads all passwords from storage and hydrates the redux store
   */
  hydratePasswords = async () => {
    const dir = await fs.readDir(globals.PERSISTENCE_PATH)
    dir.map(async element => {
      //const isDirectory = await fs.isDirectory(`${globals.PERSISTENCE_PATH}/${element}`)
      if(element.isDirectory) {
        // Create group by reading folder name
        const group = new Group('', element.name)

        const files = await fs.readDir(element.path)
        files.map(async file => this.handlePassword(element.name, file.name, group))

        // Also hydrate groups here because of performance reasons
        this.addGroupToState(group)
      } else {
        this.handlePassword(null, element.name, null)
      }
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
  collides = async(password, oldPassword, group, type) => {
    // Check if there could be a file name collision
    if(type === 'new') {
      // When newly created, just check if it can be placed in the destination folder
      const result = await this.exists(password, group)
      return result
    } else if(type === 'edit') {
      // When file is edited
      if(password.name !== oldPassword.name || password.group.name !== oldPassword.group.name) {
        // Either group or password property has changed
        const result = await this.exists(password, group)
        return result
      } else {
        // Names are equal
        return false
      }
    }
  }

  /**
   * Checks if file exists already
   * @param {Object} password Password instance with changes
   * @param {Object} group Group instance
   * @returns True if file already exists, false otherwise
   */
  exists = async (password, group) => {
    const name = nameToFileName(password.name)
    const path = group.isEmpty() === true
      ? `${globals.PERSISTENCE_PATH}/${name}.swd`
      : `${globals.PERSISTENCE_PATH}/${group.name}/${name}.swd`
    console.log(name, path)

    const exists = await fs.exists(path).catch(() => false)
    return exists === true
  }


  /**
   * Reads password from file and adds it to the state
   * @param  {String} dir Directory name
   * @param  {String} file Filename
   * @param  {Object} group Group instance
   */
  handlePassword = async (dir, file, group) => {
    // Read password data from file
    let crypt
    if(dir === null) {
      crypt = await fs.readFile(`${globals.PERSISTENCE_PATH}/${file}`)
    } else {
      crypt = await fs.readFile(`${globals.PERSISTENCE_PATH}/${dir}/${file}`)
    }
    const json = await this.decrypt(crypt)
    const pwFromJson = JSON.parse(json)

    //Create new password instance
    const password = new Password(
      pwFromJson.id,
      pwFromJson.name,
      pwFromJson.username,
      pwFromJson.password,
      pwFromJson.notes,
      new Group(),
      pwFromJson.used,
      pwFromJson.validTill
    )

    if(group !== null) {
      password.group = group
      group.passwords.push(password)
    }

    // Create password array and pass data
    this.addPasswordToState(password)
  }

  /**
   * Adds the password instance to the secured storage of the adapter
   * @param {Object} password The new password instance
   */
  addPassword = async password => {
    console.log(password, this.preparePassword(password))
    const plain = JSON.stringify(this.preparePassword(password))
    const crypt = await this.encrypt(plain)

    const filename = nameToFileName(password.name)
    console.log(password.hasGroup(), password.group)
    //const path = (isObjectEmpty(password.group)) ? `${globals.PERSISTENCE_PATH}/${filename}.swd` : `${globals.PERSISTENCE_PATH}/${password.group.name}/${filename}.swd`
    const path = (password.hasGroup()) ? `${globals.PERSISTENCE_PATH}/${password.group.name}/${filename}.swd` : `${globals.PERSISTENCE_PATH}/${filename}.swd`
    fs.createFile(path, crypt).then(result => {
      if(result === true) {
        this.addPasswordToState(password)

        if(password.hasGroup()) {
          // Get group and add password to it
          const groups = store.getState().persistence.groups
          const object = arrayHasObject(groups, 'name', password.group.name)
          object.passwords.push(password)
          this.updateGroupInState(object, 'name')
        }
      }
    }).catch(err => err)
  }

  /**
   * Updates the password instance in the adapter
   * @param  {Object} password New password instance
   * @param  {Object} oldPassword Old password instance used to identifiy the password entity to update
   */
  updatePassword = async (password, oldPassword) => {
    console.log(password, this.preparePassword(password))
    const crypt = await this.encrypt(JSON.stringify(this.preparePassword(password)))
    const filename = nameToFileName(password.name)

    if(crypt !== null || crypt !== '') {
      if(password.hasGroup() && !password.group.isEmpty()) {
        await fs.createFile(`${globals.PERSISTENCE_PATH}/${password.group.name}/${filename}.swd`, crypt)
      } else {
        await fs.createFile(`${globals.PERSISTENCE_PATH}/${filename}.swd`, crypt)
      }
    }

    this.updatePasswordInState(password, 'id')

    // Remove old password file only if directory or filename has changed
    if(password.name !== oldPassword.name || password.group.name !== oldPassword.group.name) {
      if(oldPassword.group.isEmpty()) {
        await fs.removeFile(`${globals.PERSISTENCE_PATH}/${nameToFileName(oldPassword.name)}.swd`)
      } else {
        await fs.removeFile(`${globals.PERSISTENCE_PATH}/${oldPassword.group.name}/${nameToFileName(oldPassword.name)}.swd`)
      }
    }

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
  deletePassword = async password => {
    const filename = nameToFileName(password.name)

    if(password.group === null || password.group === undefined || isObjectEmpty(password.group) === true) {
      fs.removeFile(`${globals.PERSISTENCE_PATH}/${filename}.swd`).then(() => this.deletePasswordFromState(password))
    } else {
      fs.removeFile(`${globals.PERSISTENCE_PATH}/${password.group.name}/${filename}.swd`).then(() => this.deletePasswordFromState(password))
    }
    password = null
  }

  /**
   * Reads all groups from the storage and hydrates the redux store
   */
  hydrateGroups = async () => true

  /**
   * Adds group to storage
   * @param {Object} group Group instance to be added
   */
  addGroup = group => {
    fs.createDir(`${globals.PERSISTENCE_PATH}/${group.name}`).then(res => {
      const object = arrayHasObject(store.getState().persistence.groups, 'name', group.name)
      if(res === true && object === null) {
        this.addGroupToState(group)
      }

      return res
    }).catch(err => false)
  }

  /**
   * Updates the name of the group in the storage
   * @param  {Object} group The group that needs to be changed
   * @param  {String} newName The new name of the group
   */
  updateGroup = async (group, newName) => {
    const oldGroupName = group.name
    const newGroup = group
    newGroup.name = newName
    const exists = await fs.exists(`${globals.PERSISTENCE_PATH}/${newName}`).catch(() => false)

    // Create folder if it doesnt exist
    if(exists !== true) {
      await fs.createDir(`${globals.PERSISTENCE_PATH}/${newName}`)
    }

    // Move all files from old group dir to new one
    const files = await fs.readDir(`${globals.PERSISTENCE_PATH}/${oldGroupName}`)
    files.map(async (file, index) => {
      await fs.moveFile(file.path, `${globals.PERSISTENCE_PATH}/${newName}/${file.name}`)

      if(index+1 == files.length)
        fs.removeDir(`${globals.PERSISTENCE_PATH}/${oldGroupName}`).then(() => {
          this.updateGroupInState(newGroup, 'name')
        })
    })

    // Loop was not triggered when there were no passwords assigned to a group
    if(files.length === 0) {
      fs.removeDir(`${globals.PERSISTENCE_PATH}/${oldGroupName}`).then(() => {
        this.updateGroupInState(newGroup, 'name')
      })
    }
  }

  /**
   * Removes the group from storage
   * @param {Object} group The group to be removed
   */
  deleteGroup = async group => {
    // Get all files of dir
    const name = group.name
    const files = await fs.readDir(`${globals.PERSISTENCE_PATH}/${group.name}`).catch(e => console.warn(e))
    console.log(files)
    files.map(async (file, index) => {
      //Read file contents and enqueue them in the changed passwords array.
      console.log(file, file.name, file.path)
      const crypt = await fs.readFile(`${file.path}`)
      const json = await this.decrypt(crypt)
      const password = JSON.parse(json)

      // Move file to upper layer
      fs.moveFile(`${file.path}`, `${globals.PERSISTENCE_PATH}/${file.name}`)
        .then(async result => {
        // If that succeedes then update the password in state and on disk
          if(result === true) {
            const object = arrayHasObject(store.getState().persistence.passwords, 'id', password.id)
            object.group = new Group()
            const crypt = await this.encrypt(JSON.stringify(object))
            await fs.createFile(`${globals.PERSISTENCE_PATH}/${file.name}`, crypt)

            if(index +1 === files.length) {
              // Remove group from state
              this.deleteGroupFromState(group)
              fs.removeDir(`${globals.PERSISTENCE_PATH}/${name}`)
              group = null
            }
          }
        })
    })

    if(files.length === 0) {
      this.deleteGroupFromState(group)
      fs.removeDir(`${globals.PERSISTENCE_PATH}/${name}`)
      group = null
    }
  }

  /*
   * Removing circular dependencies. E.g. removing the group.passwords prop.
   */
  preparePassword = password => {
    const newPassword = password.cloneWithoutGroup()
    if(newPassword.group !== null && !newPassword.group.isEmpty()) {
      newPassword.group = password.group.clone() // Group clone has no passwords array
    }

    return newPassword
  }

  /**
   * Collect files that should be pushed to sync adapter
   * @param {Object} object Contains the path of all files in case all=true. Otherweise it contains the model of file or dir
   * @param {Boolean} all Flag if all data of a dir should be collected or just a single file
   * @param {String} type Can contain 'file' or 'dir' whether it is a file or not
   * @returns Map with FileSystemItems
   */
  collectFilesForPushSync = async (object, all = false, type) => {
    if(all) {
      return await fsToMap(object)
    } else {
      const map = new Map()

      // If file has to be synced create a file item
      if(type === 'file') {
        const localPath = !object.hasGroup()
          ? `${globals.PERSISTENCE_PATH}/${object.name}`
          : `${globals.PERSISTENCE_PATH}/${object.group.name}/${object.name}`
        console.log(localPath)
        const remotePath = !object.hasGroup()
          ? `${DIRECTORY_PREFIX}/${object.name}`
          : `${DIRECTORY_PREFIX}/${object.group.name}/${object.name}`
        console.log(remotePath)


        const result = await fs.readFile(localPath).catch(e => console.error(e))
        console.log(result)

        map.set(new FileSystemItem(object.name, remotePath, false, 1), result)
      } else {
        const remotePath = `${DIRECTORY_PREFIX}/${object.name}`

        // Is dir
        map.set(new FileSystemItem(name, remotePath, true, 1), '')
      }

      return map
    }
  }

  /**
   * Collects additional files that should be synced, like keys used by an adapter.
   * @returns Map with FileSystemItems
   */
  collectAdditionalFilesForPushSync = async () => {
    const configuration = await store.getState().config.store.get()
    const result = new Map()
    const privateKey = await fs.readFile(`${configuration.path}/private.key`)
    console.log('privateKey', privateKey)
    result.set(new FileSystemItem('private.key', `${configuration.path}/private.key`, false, 1), privateKey)

    const publicKey = await fs.readFile(`${configuration.path}/public.key`)
    console.log('publicKey', publicKey)
    result.set(new FileSystemItem('public.key', `${configuration.path}/public.key`, false, 1), publicKey)

    return result
  }

  /**
   * Processes all password files that have been pulled from the remote server during sync.
   * @param  {Map} map Map containing FileSystemItems with files from remote server
   * @param  {Boolean} all=false True if all data should be pulled
   * @param  {String} password
   * @returns Promise which resolves to true when sync successfully finished. Resolves to false otherwise
   */
  processFilesOfPullSync = async (map, all = false, password) => {
    if(all) {
      // Clear all local files
      const content = await fs.readDir(globals.PERSISTENCE_PATH)
      console.log(content)
      content.map(async item => {
        if(item.isDirectory) {
          await fs.removeDir(item.path)
        } else {
          await fs.removeFile(item.path)
        }
      })

      // Now copy all files
      for (let [key, value] of map) {
        if(key.isDirectory) {
          await fs.createDir(`${globals.PERSISTENCE_PATH}/${key.name}`)

          const dir = value
          for (let [file, content] of dir) {
            await fs.createFile(`${globals.PERSISTENCE_PATH}/${key.name}/${file.name}`, content)
          }
        } else {
          await fs.createFile(`${globals.PERSISTENCE_PATH}/${key.name}`, value)
        }
      }

      return true
    } else {
      // Overwrite single file

    }
  }

  /**
   * Processes all additional files that have been pulled from the web storage during sync.
   * @param {Map} map Map with FileSystemItems
   * @returns If operation was successful
   */
  processAdditionalFilesOfPullSync = async map => {
    const configuration = await store.getState().config.store.get()

    for (let [key, value] of map) {
      fs.createFile(`${configuration.path}/${key.name}`, value)
    }

    return true
  }
}
