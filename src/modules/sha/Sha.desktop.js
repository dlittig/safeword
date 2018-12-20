import crypto from 'crypto'

/**
 * Hashes the content with SHA256
 * @param {String} content Content to hash
 * @returns Hash as hex string
 */
export const hash256 = async content => {
  const hash = crypto.createHash('sha256')
  hash.update(content)
  return hash.digest('hex')
}
