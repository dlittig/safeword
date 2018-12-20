import { NativeModules } from 'react-native'
const Encryption = NativeModules.EncryptionModule
import Random from '../random'

const IV_LENGTH = 16

/**
 * Encrypts the text with AES256 in CBC Mode.
 * @param {String} key Key to encrypt the plaintext
 * @param {String} plaintext Plaintext
 * @returns Encrypted text
 */
const encrypt = async (key, plaintext) => {
  const iv = Random.randomBytes(IV_LENGTH)

  // Plaintext, key and iv have to be hex string
  const encryptedText = await Encryption.encrypt(plaintext, key.toString('hex'), iv.toString('hex'))

  // Encrypted text is utf8 string as hex encoded
  return `${iv.toString('hex').toLowerCase()}:${encryptedText.toLowerCase()}`
}

/**
 * Decrypts the ciphertext with AES256 in CBC Mode.
 * @param {String} key Key to decrypt the ciphertext
 * @param {String} cryptText CipherText
 * @returns Decrypted plaintext
 */
const decrypt = async (key, cryptText) => {
  const textParts = cryptText.split(':')
  const iv = Buffer.from(textParts.shift(), 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex').toString('hex')

  const plaintext = await Encryption.decrypt(encryptedText, key.toString('hex').toLowerCase(), iv.toString('hex').toLowerCase())

  return plaintext
}

export { encrypt, decrypt }
