import { DeviceEventEmitter } from 'react-native'
import NavigationService from '../../service/native/NavigationService'

/**
 * Listener callback that performs the locking process
 * @param {Object} event Event for debugging process
 * @param {Function} callback Callback that actually does the locking process
 * @param {Object} navigation Navigation service to change location after locking successfully completed
 */
const listener = (event, callback, navigation) => {
  console.log(event)
  callback()
  navigation.navigate('Login')
  DeviceEventEmitter.removeAllListeners(event)
}

/**
 * Intializes all necessary listeners.
 * @param {Function} callback Callback that actually does the locking process
 * @param {Object} navigation Navigation service to change location after locking successfully completed
 */
const init = (callback, navigation) => {
  DeviceEventEmitter.addListener('ON_HOME_BUTTON_PRESSED', () => listener('ON_HOME_BUTTON_PRESSED', callback, navigation))
}

export { init }
