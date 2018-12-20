import { NativeModules } from 'react-native'
const Encryption = NativeModules.EncryptionModule

/**
 * Hashes the content with SHA256
 * @param {String} content Content to hash
 * @returns Hash as hex string
 */
export const hash256 = async text => {
  const hash = await Encryption.sha256(text)
  if(hash === null) throw 'sha256'
  else return hash
}
