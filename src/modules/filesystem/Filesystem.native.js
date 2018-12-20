import fs from 'react-native-fs'
import globals from '../../globals'
import { requestPermissions } from '../permissions/permissions.native'
import FileSystemItem from './FileSystemItem'

/**
 * Checks if the path is a directory
 * @param {String} path Path of the directory
 * @returns {Boolean} True in case the path is a directory, otherwise false
 */
const isDirectory = path => fs.stat(path).then(result => result.isDirectory)

/**
 * Reads dir content
 * @param {String} dir Path of dir
 * @returns {Array} Array filled with FileSystemItems
 */
const readDir = dir =>  fs.readDir(dir)
  .then(result => {
    const content = []
    result.map(item => {
      content.push(new FileSystemItem(item.name, item.path, item.isDirectory(), item.size))
    })
    return content
  })
  .catch(error => null)

/**
 * Creates directory if it not exists.
 * @param {String} path Path of dir
 * @returns {Boolean} Returns true on success
 */
const createDir = path => fs.mkdir(path).then(() => true).catch(error => false)

/**
 * Removes directory from filesystem
 * @param {String} path Path to the directory
 * @returns {Boolean} True when the directory was successfully removed
 */
const removeDir = path => fs.unlink(path).then(() => true)

/**
 * Reads content of file
 * @param {String} path Path to file
 * @returns {String} The content of the file
 */
const readFile = path => fs.readFile(path).then(result => result).catch(result => null)

/**
 * Creates file. If it already exists, content will be overwritten.
 * @param {String} path Path of dir
 * @param {String} content Content to insert into the file. Defaults to empty string
 * @returns Returns true on success
 */
const createFile = (path, content = '') => fs.writeFile(path, content.toString(), 'utf8').then(result => true).catch(error => false)

/**
 * Appends content to an existing file.
 * @param {String} path Path to the file
 * @param {String} content Content that should be appended to the file
 * @returns {Boolean} True when appending process succeeded
 */
const appendToFile = (path, content) => fs.appendFile(path, content)

/**
 * Moves a file to a new destination
 * @param {String} oldPath Old path of the file
 * @param {String} newPath New path of the file
 * @returns {Boolean} True if move finished successfully
 */
const moveFile = (oldPath, newPath) => fs.moveFile(oldPath, newPath).then(() => true)

/**
 * Removes file from filesystem.
 * @param {String} path Path to the file
 * @returns {Boolean} True if file was removed
 */
const removeFile = path => fs.unlink(path).then(result => true)

/**
 * Checks if file or directory exists by checking if target is writable.
 * @param {String} path Path of the item
 * @returns {Boolean} True if item exists
 */
const exists = path => fs.exists(path)

/**
 * Creates minimal directory structure in the filesystem,
 * which is necessary that the application can perform properly.
 * @returns {Boolean} True if structure was created successfully, otherwise false
 */
const createBaseStructure = () => (
  createDir(globals.BASE_PATH).then(result => {
    if(result === false) {
      return false
    } else {
      return createDir(globals.CONFIG_PATH)
    }
  }).then(result => {
    if(result === false) {
      return false
    } else {
      return createDir(globals.PERSISTENCE_PATH)
    }
  })
)

/**
 * Checks if the required base structure is present
 * @returns {Boolean} True when structure is present, otherwise false
 */
const checkFiles = () =>
  requestPermissions().then(result => {
    if(result === true) {
      return new Promise((resolve, reject) => {
        exists(globals.BASE_PATH).then(result => {
          if(result === true) {
            resolve(true)
          } else reject(false)
        })
      })
    } else return false
  }).then(result => {
    if(result === true) {
      return exists(globals.CONFIG_PATH)
    } else return false
  }).then(result => {
    if(result === true) {
      return exists(globals.PERSISTENCE_PATH)
    } else return false
  })


const monitor = async () => {
  const dir = await readDir(globals.PERSISTENCE_PATH)

  dir.map(async fsItem => {
    console.dir(fsItem)
    if(fsItem.isDirectory) {
      const passwords = await readDir(fsItem.path)
      passwords.map(pw => console.dir(pw))
    }
  })
}

// require the module
var RNFS = fs

// get a list of files and directories in the main bundle
RNFS.readDir(globals.CONFIG_PATH) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  .then((result) => {
    console.log('GOT RESULT', result)

    // stat the first file
    return Promise.all([RNFS.stat(result[0].path), result[0].path])
  })
  .then((statResult) => {
    if (statResult[0].isFile()) {
      // if we have a file, read it
      return RNFS.readFile(statResult[1], 'utf8')
    }

    return 'no file'
  })
  .then((contents) => {
    // log the file contents
    console.log(contents)
  })
  .catch((err) => {
    console.log(err.message, err.code)
  })

export { monitor, readDir, isDirectory, createDir, removeDir, readFile, createFile, appendToFile, removeFile, moveFile, createBaseStructure, exists, checkFiles }
//export { create, remove, createFile, createDir, createBaseStructure, exists, checkFiles }
