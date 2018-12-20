import { remote } from 'electron'

/**
 * Listener callback that performs the locking process
 * @param {Object} event Event for debugging process
 * @param {Function} callback Callback that actually does the locking process
 * @param {Object} navigation Navigation service to change location after locking successfully completed
 */
const listener = (event, callback, navigation) => {
  callback()
  navigation.replace('/login')
}

/**
 * Intializes all necessary listeners.
 * @param {Function} callback Callback that actually does the locking process
 * @param {Object} navigation Navigation service to change location after locking successfully completed
 */
const init = (callback, navigation) => {
  const window = remote.BrowserWindow.getFocusedWindow()
  window.once('blur', () => listener('blur', callback, navigation))
}

export { init }
