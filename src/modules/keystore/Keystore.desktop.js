import Keytar from 'keytar'

/**
 * Receives key from key store of OS.
 * @param {String} key Identifier
 * @returns The corresponding value or undefined if not set
 */
const get = key => Keytar.getPassword('safeword', key).then(res => res).catch(err => undefined)

/**
 * Saves key value pair in key store of OS.
 * @param {*} key Identifier
 * @param {*} value Value
 */
const set = (key, value) => Keytar.setPassword('safeword', key, value)

export { get, set }
