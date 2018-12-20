import globals from '../../globals'

let randomBytes = ''
if(globals.PLATFORM === 'mobile') {
  randomBytes = require('./Random.native').random
} else {
  randomBytes = require('./Random.desktop').random
}

const ALPHA_UP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ALPHA_LOW = 'abcdefghijklmnopqrstuvwxyz'
const NUM = '0123456789'
const SPECIAL = '_-:.#@+/\\!?$%&='
const COMPLETE_CHARSET = `${ALPHA_LOW}${ALPHA_UP}${NUM}${SPECIAL}`

/**
 * Generates random strings
 * @param {String} charset Charset to pick letters from
 * @param {Integer} length Length of the resulting string
 * @returns Cryptographically random string
 */
const get = (charset = null, length = 0) => new Promise((resolve, reject) => {
  if(charset === null) {
    throw 'You have to specify a charset to get a random string'
  }

  let result = ''

  randomBytes(length, (err, bytes) => {
    for(let i=0; i < bytes.length; i++) {
      result += charset.charAt(bytes[i] % charset.length)
    }

    resolve(result)
  })
})

/**
 * Generates a default password which is 32 letters long
 * @returns Random Password
 */
const getDefaultPassword = () => new Promise(async resolve => resolve(await get(COMPLETE_CHARSET, 32)))

/**
 * Generates a master password which is 128 letters long
 * @returns Random master password
 */
const getMasterPassword = () => new Promise(async resolve => resolve(await get(COMPLETE_CHARSET, 128)))

/**
 * Generates a salt which is 32 Letters long, which results in a 256 bit string
 * @returns Random salt
 */
const getSalt = () => get(COMPLETE_CHARSET, 32)

export default { get, getDefaultPassword, getMasterPassword, ALPHA_UP, ALPHA_LOW, NUM, SPECIAL, randomBytes, getSalt }
