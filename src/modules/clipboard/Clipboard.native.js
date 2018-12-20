import { Clipboard } from 'react-native'
import Sha from '../sha'

/**
 * Copies text to clipboard
 * @param {String} text Text
 * @param {Object} param1 Object contains 'wipe' (boolean if the clipboard should be wiped afterward),
 * 'duration' (integer in ms) and 'callback', which will be called after clear()
 */
export const copy = (text, {wipe, duration, callback}) => {
  Clipboard.setString(text)
  if(wipe === true) {
    clear(duration, text, callback)
  }
}

/**
 * Removes the text from clipboard if is still in clipboard
 * @param {Integer} duration Duration after which the clipboard will be cleared
 * @param {String} oldText The previously copied text
 * @param {Function} callback Callback which will be triggered after the clipboard was cleared
 */
export const clear = async (duration, oldText, callback = {}) => {
  const oldHash = await Sha.hash256(oldText)
  setTimeout(async () => {
    console.log('oldHash', oldHash)
    const currentText = await Clipboard.getString()
    console.log('currentText', currentText)
    const newHash = await Sha.hash256(currentText)
    console.log('newHash', newHash)
    if(oldHash === newHash) {
      console.log('equals')
      Clipboard.setString('')
      callback()
    }
  }, duration)
}
