const crypto = require('crypto')

/**
 * Hashes the password with PBKDFv2 and SHA512
 * @param {String} password The password that should be hashed
 * @param {String} salt Salt for hashing
 * @returns Computed hash
 */
const hash = (password, salt) => new Promise(resolve => {
  crypto.pbkdf2(password, salt, 25000, 32, 'sha512', (err, derivedKey) => { //32 Bytes = 256 Bit
    if (err) throw err
    resolve(derivedKey)  // '3745e48...08d59ae'
  })
})

export { hash }
