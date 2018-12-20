import fs from '../../../modules/filesystem'
import { persistenceAdapters } from '../../../adapters'
import Masterkey from '../../../modules/masterkey'
import { store } from '../../../store'
import { Setup } from '../../../store/actions/Setup'
import SettingsParameters from '../../../settings/params'

/**
 * Handles finish of setup. Sets up all required modules
 * @param {Object} param0 Object that requires attributes: setup, configuration,
 * settings, selection (refers to the unique id of persistence mechanism), path, navigateTo
 */
const handleComplete = ({setup, configuration, settings, selection, path, navigateTo}) => {
  // Get the corresponding instance of the adapter
  let adapter = null
  for(let i=0; i<persistenceAdapters.length; i++) {
    if(persistenceAdapters[i].describe() === selection) {
      adapter = persistenceAdapters[i]
      break
    }
  }

  let key = ''
  filesystem(adapter)
    .then(() => masterkey(setup.password).then(result => {key = result}))
    .then(() => persistence(setup, key, adapter))
    .then(() => config(configuration, key, selection, path))
    .then(() => profile(setup, key, settings))
    .then(() => {
      store.dispatch(Setup.complete())
      navigateTo()
    })
    .catch(error => console.warn(error))
}

/**
 * Creates the base structure of folders in the file system
 * @param {Object} adapter Adapter used for processing later on
 * @returns True when filesystem was setup and adapter has been passed
 */
const filesystem = async adapter => {
  const result = await fs.createBaseStructure()
  if(result !== null && result === true && adapter !== null) return true
  else throw 'Filesystem'
}

/**
 * Creates the masterkey
 * @param {String} password The password passed by the user
 * @returns Random key that should be used for encryption
 */
const masterkey = async password => {
  const key = await Masterkey.create(password)
  if(key !== null) return key
  else throw 'Masterkey'
}

/**
 * Sets up the persistence adapter
 * @param {Object} setup Setup state for additional data
 * @param {String} key Random key
 * @param {Object} adapter Adapter that should be initialized
 * @returns True if adapter successful initialized
 */
const persistence = async (setup, key, adapter) => {
  await adapter.clean()
  const result = await adapter.create(setup.additional, key)
  if(result !== null && result === true) return true
  else throw 'Persistence'
}

/**
 * Sets configuration properties.
 * @param {Object} configuration Configuration object
 * @param {String} key Random key from masterkey
 * @param {String} selection Selected adapter
 * @param {String} path Path to key files
 * @returns True when successfully set up
 */
const config = async (configuration, key, selection, path) => {
  await configuration.clean()

  const collection = await configuration.load(key)
  if(collection == null) throw 'Loading configuration'

  const result = await configuration.set(selection, path, true)
  if(result !== null && result === true) return true
  else throw 'Configuration'
}

/**
 * Initializes settings with profile data.
 * @param {Object} setup Setup object containing profile data
 * @param {String} key Random key
 * @param {Object} settings Settings object to save the profile to
 * @returns True when successfully set up
 */
const profile = async (setup, key, settings) => {
  const { firstname, lastname, birthday } = setup

  await settings.clean()
  const collection = await settings.load(key)
  if(collection == null) throw 'Loading settings'

  await settings.set(SettingsParameters.PROFILE_FIRSTNAME, firstname)
  await settings.set(SettingsParameters.PROFILE_LASTNAME, lastname)
  await settings.set(SettingsParameters.PROFILE_BIRTHDAY, birthday)

  await settings.initReadOnly()
  return true
}

/**
 * Checks if the password is valid to be used with Safeword
 * @param {String} password
 * @returns True if valid, otherwise false
 */
const validatePassword = password => {
  const policy = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.\-_\+\/\(\)\\\?:;])(?=.{16,})')

  return policy.test(password)
}

const TEXT_START = 'Welcome to Safeword. With Safeword you can store your passwords fully encrypted using different technologies. In the following setup you can choose between Rx, a classic database stored in this app, or OpenPGP. OpenPGP is a widely used standard and with OpenPGP encrypted passwords are stored on your harddrive.'
const TEXT_PROFILE = 'Now you need to enter some details about you, so that Safeword can provide better assistence when rating your password.'
const TEXT_MASTERPASSWORD = 'You nearly finished the setup! On the next screen you have to set your secure master password that is used to unlock your encrypted passwords.'

export { handleComplete, validatePassword, TEXT_START, TEXT_PROFILE, TEXT_MASTERPASSWORD }
