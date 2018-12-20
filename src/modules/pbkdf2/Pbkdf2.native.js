import { NativeModules } from 'react-native'
const Encryption = NativeModules.EncryptionModule

/**
 * Hashes the password with PBKDFv2 and SHA512
 * @param {String} password The password that should be hashed
 * @param {String} salt Salt for hashing
 * @returns Computed hash
 */
const hash = (password, salt) => new Promise((resolve, reject) => {
  Encryption.pbkdf2(password, salt, 25000, 32) //256 Bit
    .then(key => {
      if(key !== null)
        resolve(Buffer.from(key, 'hex'))
      else reject(false)
    })
})

export { hash }
