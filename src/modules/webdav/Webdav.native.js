/**
 * Creates a client to connect to a webdav server
 * @param {String} url Remote url of the server
 * @param {String} user Username to connect to protected remote server
 * @param {String} pw Password to connect to protected remote server
 * @returns Connected client
 */
export const client = (url, user, pw) => {
  require('stream').Stream.prototype = {}
  const createClient = require('webdav')
  return createClient(url, user, pw)
}
