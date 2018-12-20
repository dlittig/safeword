import { store } from '../../../store'
import { syncAdapters } from '../../../adapters'
import { Sync } from '../../../store/actions/Sync'
import { guessTypeFromString, fsToMap } from '../../../utils'
import SettingsParameters from '../../../settings/params'
import globals from '../../../globals'
import Masterkey from '../../../modules/masterkey'
import fs from '../../../modules/filesystem'
import Keystore from '../../../modules/keystore'
import { ADDITIONAL_PREFIX, KEY_PREFIX, DIRECTORY_PREFIX } from './parameters'

/**
 * Searches for the adapter and saves it to the redux state.
 * Then check if sync can be performed.
 * @param {Boolean} pull Flag if data should be pulled or pushed
 * @param {Boolean} withKeys If key files should be synced too
 * @param {Object} settings Settings object writable
 * @param {String} decryptPassword Random key for decryption
 * @param {Function} callback Callback that will called on success
 */
const start = async (pull = false, withKeys = false, settings, decryptPassword = '', callback) => {
  console.log(pull, withKeys, callback)

  //const start = async (alreadySynced, decryptPassword, navigateTo) => {
  const syncAdapter = await init()
  console.log('start', 1, syncAdapter)
  if(syncAdapter === null) return false

  // Check if data was saved before
  //const wasSetupOnServer = (await syncAdapter.getMarker() !== null) || false
  console.log('start', 2, syncAdapter)
  await syncKeys(syncAdapter, pull, withKeys)
  console.log('start', 3)

  let key = ''
  if(decryptPassword !== '') {
    // A password is passed from a backup with potentially different password
    key = await getRandomKey(decryptPassword)
  } else {
    // Sync was setup before, take random key from keystore
    key = await Keystore.get('safeword')
  }

  if(pull && withKeys) {
    console.log('start', 4, key)
    // Only rebuild databases if performing a fresh sync, when there was no sync at all
    await rebuildAdapter(key)
    await rebuildSettingsAndConfig(key)
    //await syncPersistenceAdapterFiles(syncAdapter, pull)
  }
  console.log('start', 5, key)
  await syncFiles(syncAdapter, pull, key)

  // Redirect to login and reset all redux states. Show alert dialog before redirecting
  settings.set(SettingsParameters.SYNC_PERFORMED, new Date().getTime().toString())
  await settings.initReadOnly()
  console.log(settings)
  callback()
}

/**
 * Syncs key files.
 * @param {Object} syncAdapter Sync adapter
 * @param {Boolean} pull If data should be pushed or pulled
 * @param {Boolean} withKeys
 */
const syncKeys = async (syncAdapter, pull, withKeys) => {
  if(!pull && withKeys) {
    // No keys on server, and never synced
    const keys = await collectKeysForPushSync()
    console.log('start', 8, keys)
    for (let [key, value] of keys) {
      await syncAdapter.pushFile(`${KEY_PREFIX}/${key.name}`, value)
    }
  } else if(pull && withKeys) {
    // Keys on server and never synced
    const map = await syncAdapter.pullDir(KEY_PREFIX)
    await processKeysOfPullSync(map)
  }
}

/**
 * Gets the random key from masterkey
 * @param {String} decryptPassword password to decrypt the masterkey
 * @returns Returns the random key
 */
const getRandomKey = async decryptPassword => {
  const result = await Masterkey.unlock(decryptPassword)
  if(result === false || result === null) return null
}

/**
 * Rebuilds the adapter by accessing its rebuild function
 * @param {String} key Random key used to create the new DB
 */
const rebuildAdapter = async key => {
  const {adapter} = store.getState().persistence
  await adapter.rebuild(key)

  return true
}

/**
 * Rebuilds settings and configuration by accessing their rebuild function
 * @param {String} key Random key used to create the new DB
 * @returns True when successful
 */
const rebuildSettingsAndConfig = async key => {
  const {settings: {store: settings}, config: {store: config}} = store.getState()

  // Reinitializing settings and config
  await settings.rebuild(key)
  await config.rebuild(key)
  return true
}

/**
 * Sync additional files used by the adapter
 * @param {Object} syncAdapter Adapter that is being used for synchronization
 * @param {Boolean} pull Boolean if data should be pulled or pushed
 */
const syncPersistenceAdapterFiles = async (syncAdapter, pull) => {
  // TODO create function in persistenceAdapters: openpgp sync key files, rx just doesnt do anything in this function
  const {adapter} = store.getState().persistence
  if(!pull) {
    const map = await adapter.collectAdditionalFilesForPushSync()
    console.log('additional', map)
    for (let [key, value] of map) {
      syncAdapter.pushFile(`${ADDITIONAL_PREFIX}/${key.name}`, value)
    }
  } else {
    // Pull files from server
    const map = await syncAdapter.pullDir(ADDITIONAL_PREFIX)
    await adapter.processAdditionalFilesOfPullSync(map)
  }
}

/**
 * Syncs files with remote server
 * @param {Object} syncAdapter Sync adapter
 * @param {Boolean} pull If data is being pulled or pushed
 * @param {String} key Key to decrypt
 */
const syncFiles = async (syncAdapter, pull, key) => {
  syncPersistenceAdapterFiles(syncAdapter, pull)
  if(pull) {
    await syncAdapter.pullAll(key)
    await syncAdapter.setMarker()
    return true
  } else {
    await syncAdapter.pushAll()
    await syncAdapter.setMarker()
    return true
  }
}


/**
 * Initializes the syncAdapter and saves it to the redux store
 * @returns Returns the adapter or null
 */
const init = async () => {
  console.log('init')
  const settings = store.getState().settings.readOnly
  let syncAdapter = store.getState().sync.adapter

  console.log('init', settings, syncAdapter)

  // Get credentials to connecto to the server with the proper adapter
  const protocol = guessTypeFromString(settings.get(SettingsParameters.WEBDAV_HTTPS)) === true ? 'https://' : 'http://'
  const url = `${protocol}${settings.get(SettingsParameters.WEBDAV_URL)}`
  const user = settings.get(SettingsParameters.WEBDAV_USERNAME)
  const pw = settings.get(SettingsParameters.WEBDAV_PASSWORD)

  if(syncAdapter === null || syncAdapter === undefined) {
    const selectedAdapter = settings.get(SettingsParameters.SYNC_ADAPTER)
    for(let i=0; i < syncAdapters.length; i++) {
      if(syncAdapters[i].describe() === selectedAdapter) {
        syncAdapter = syncAdapters[i]
        break
      }
    }

    store.dispatch(Sync.set(syncAdapter))
  }

  if(!syncAdapter.validateCredentials({url, user, pw})) return null
  console.log('init connect')
  const success = await syncAdapter.connect({url, user, pw})
  console.log('connect result init', success)
  if(success === false || success === null) return null

  return syncAdapter
}

/**
 * Handle pulled key files
 * @param {Map} map Map containing all key files
 * @returns True on success, false otherwise
 */
const processKeysOfPullSync = async map => {
  // Now copy all files
  for (let [key, value] of map) {
    await fs.createFile(`${globals.CONFIG_PATH}/${key.name}`, value)
  }

  return true
}

/**
 * Collects files to push to remote server
 * @returns Map cotaining all necessary FileSystemItems
 */
const collectKeysForPushSync = async () => {
  return await fsToMap(globals.CONFIG_PATH)
}

export { start, init, processKeysOfPullSync, collectKeysForPushSync }
