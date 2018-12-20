import { persistenceAdapters, syncAdapters } from '../../../adapters'
import Keystore from '../../../modules/keystore'
import { store } from '../../../store'
import { Persistence as PersistenceAction } from '../../../store/actions/Persistence'
import { Sync as SyncAction } from '../../../store/actions/Sync'
import SettingsParameters from '../../../settings/params'
import Masterkey from '../../../modules/masterkey'
import Locker from '../../../modules/locker'
import Protocol from '../../../modules/protocol'
import { start } from '../Sync'

/**
 * Starts the login process and initializes several components
 * @param  {String} password password to unlock the components
 * @param  {Object} configuration Configuration object
 * @param  {Object} settings Settings object
 * @param  {Object} navigation Navigation object to navigate to other routes or screens
 */
const login = (password, configuration, settings, navigation) => {
  let key = ''
  let safeword = {}

  return masterkey(password).then(result => key = result)
    .then(() => config(key, configuration).then(entity => safeword = entity))
    .then(() => setting(key, settings))
    .then(() => persistence(safeword, key))
    .then(() => keystore(key))
    .then(() => log())
    .then(() => sync())
    .then(() => {
      setupLock(navigation)
      return true
    })
    .catch(error => {
      console.warn(error)
      Protocol.log(false)
      return false
    })
}

/**
 * Unlocks masterkey.
 * @param {*} password Password from user
 * @returns Decrypted random key
 */
const masterkey = async password => {
  const result = await Masterkey.unlock(password)
  if(result === false || result === null) throw 'Masterkey'
  else return result
}

/**
 * Loads settings and initializes readOnly field in redux store.
 * @param {String} key Password
 * @param {Object} settings Settings object
 * @returns True when initialized properly
 */
const setting = async (key, settings) => {
  const settingsAreLoaded = await settings.load(key)
  if(settingsAreLoaded === null) throw 'Loading settings'
  const initReady = await settings.initReadOnly()
  if(initReady !== true) throw 'Initializing read only settings'
  else return true
}

/**
 * Loads configuration and validates that it has not been compromised.
 * @param {String} key Password
 * @param {Object} configuration Configuration object
 * @returns Row of configuration database
 */
const config = async (key, configuration) => {
  const collection = await configuration.load(key)
  if(collection === null) throw 'Loading configuration'

  const result = await configuration.validate(collection)
  if(result !== true) throw 'Validating configuration'

  return collection.findOne({id: '0'}).exec()
}

/**
 * Adds peristence adapter to redux store. Unlocks the user data.
 * @param {Object} safeword Configuration object
 * @param {String} key Password to unlock the configuration database
 * @returns True if successfully unlocked
 */
const persistence = async (safeword, key) => {
  let adapter = null
  for(let i=0; i < persistenceAdapters.length; i++) {
    if(persistenceAdapters[i].describe() === safeword.type) {
      adapter = persistenceAdapters[i]
      break
    }
  }

  store.dispatch(PersistenceAction.set(adapter))
  const unlocked = await adapter.unlock(key, safeword).catch(e => console.warn(e))
  if(unlocked === false) throw 'Persistence'
  else return unlocked
}

/**
 * Adds the password the keystore of the OS
 * @param {String} key Key to store in Keystore
 * @returns Boolean when successful
 */
const keystore = async key => {
  return await Keystore.set('safeword', key)
}

/**
 * Sets up the screen locker
 * @param {Object} navigation Navigation object to navigate to other screen when locking
 * @returns True on success
 */
const setupLock = async navigation => {
  Locker.init(Locker.callback, navigation)
  return true
}

/**
 * Check if data was synced before. If it was synced before, start a sync attempt
 * to get the lastest data. Add Sync adapter to redux store
 * @returns True on success
 */
const sync = async () => {
  return true

  const {settings: {readOnly: settingsReadOnly}, settings: {store: settings}} = store.getState()
  const enabled = settingsReadOnly.get(SettingsParameters.SYNC_ADAPTER) !== null && settingsReadOnly.get(SettingsParameters.SYNC_ADAPTER) !== ''
  const selectedAdapter = settingsReadOnly.get(SettingsParameters.SYNC_ADAPTER) || null
  const syncedBefore = settingsReadOnly.get(SettingsParameters.SYNC_PERFORMED) || false

  if(selectedAdapter === null) return true

  // Init sync adapter
  let syncAdapter = null
  for(let i=0; i < syncAdapters.length; i++) {
    if(syncAdapters[i].describe() === selectedAdapter) {
      syncAdapter = syncAdapters[i]
      break
    }
  }

  store.dispatch(SyncAction.set(syncAdapter))

  // Only start sync if synced before
  if(enabled && syncedBefore) {
    await start(true, false, settings, '', () => {})
  }

  return true
}

/**
 * Add the authentication attempt to log file
 */
const log = async () => Protocol.log(true)

/**
 * Hydrate redux state with password entities read from db
 */
const hydrate = async () => {
  // Rehydrate passwords and groups
  const {persistence: {adapter}} = store.getState()
  adapter.hydratePasswords()
  adapter.hydrateGroups()
}

export { login, hydrate }
