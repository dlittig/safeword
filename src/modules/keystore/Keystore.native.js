import * as Keychain from 'react-native-keychain'

/**
 * Receives key from key store of OS.
 * @param {String} key Identifier
 * @returns The corresponding value or undefined if not set
 */
const get = key => Keychain.getGenericPassword({service: 'safeword'}).then(res => {
  if(res.username === key) {
    return res.password
  } else return undefined
}).catch(err => undefined)

/**
 * Saves key value pair in key store of OS.
 * @param {*} key Identifier
 * @param {*} value Value
 */
const set = (key, value) => Keychain.setGenericPassword(key, value, {service: 'safeword'}).then(res => res).catch(error => false)

export { get, set }
