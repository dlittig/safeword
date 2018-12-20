import globals from '../../globals'
import Pbkdf2 from '../pbkdf2'
import Random from '../random'
import fs from '../filesystem'
import Aes from '../aes'

/**
 * Create the masterkey with several cryptographic functions.
 * @param {String} password Password entered by the user
 * @returns Random key that is being used to encrypt all data
 */
const create = password => new Promise(async resolve => {
  // Generate salt
  const salt = await Random.getSalt()

  // Generate key from password with pbkdf
  const key = await Pbkdf2.hash(password, salt)

  // Generate random key
  const random = await Random.getMasterPassword()

  // Encrypt key with aes and the derived key as passphrase for aes
  const cipherText = await Aes.encrypt(key, random)

  // Save key to drive
  const result = await fs.createFile(`${globals.CONFIG_PATH}/master.swk`, cipherText)
  const saltResult = await fs.createFile(`${globals.CONFIG_PATH}/salt.swk`, salt)

  resolve(random)
})

/**
 * Decrypts the data in the masterkey with several cryptographic functions.
 * @param {String} password Password entered by the user
 * @returns Decrypted random key
 */
const unlock = async password => new Promise(async resolve => {
  // Read salt
  const salt = await fs.readFile(`${globals.CONFIG_PATH}/salt.swk`)

  // Generate key from password with pbkdf
  const key = await Pbkdf2.hash(password, salt)

  // Read ciphertext from file
  const cipherText = await fs.readFile(`${globals.CONFIG_PATH}/master.swk`)

  // Decrypt random key with derived key from passphrase
  Aes.decrypt(key, cipherText)
    .then(random => resolve(random))
    .catch(e => resolve(false))

})

export default { create, unlock }
