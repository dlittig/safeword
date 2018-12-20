import fs from '../filesystem'
import rnfs from 'react-native-fs'
import globals from '../../globals'

/**
 * Logs an authentication attempt to a log file
 * @param {Boolean} successful If a successful attempt shoud be logged
 */
const write = async successful => {
  const name = `${rnfs.ExternalDirectoryPath}/access.log`
  const line = successful
    ? `[${new Date().toLocaleString()}]: Authentication successful on ${globals.PLATFORM}\n`
    : `[${new Date().toLocaleString()}]: Authentication failed on ${globals.PLATFORM}\n`

  // Check if file exists
  const exists = await fs.exists(name)

  // Append line to file
  if(exists) {
    fs.appendToFile(name, line)
  } else {
    fs.createFile(name, line)
  }
}

export { write }
