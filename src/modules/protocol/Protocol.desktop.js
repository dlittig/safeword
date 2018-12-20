import fs from '../filesystem'
import globals from '../../globals'
import os from 'os'

/**
 * Logs an authentication attempt to a log file
 * @param {Boolean} successful If a successful attempt shoud be logged
 */
const write = async successful => {
  // Check if file exists is not needed in node
  const name = `${globals.CONFIG_PATH}/access.log`
  const line = successful
    ? `[${new Date().toLocaleString()}]: Authentication successful on ${globals.PLATFORM}${os.EOL}`
    : `[${new Date().toLocaleString()}]: Authentication failed on ${globals.PLATFORM}${os.EOL}`

  // Append line to file
  fs.appendToFile(name, line)
}

export { write }
