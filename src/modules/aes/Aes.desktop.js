const crypto = require('crypto')

const IV_LENGTH = 16 // For AES, this is always 16

/**
 * Encrypts the text with AES256 in CBC Mode.
 * @param {String} key Key to encrypt the plaintext
 * @param {String} plaintext Plaintext
 * @returns Encrypted text
 */
const encrypt = async (key, plaintext) => {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
  cipher.setAutoPadding(true)
  let encrypted = cipher.update(plaintext)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
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
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv)
  decipher.setAutoPadding(true)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

export { encrypt, decrypt }
