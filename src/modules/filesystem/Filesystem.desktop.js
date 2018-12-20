import globals from '../../globals'
import fs from 'fs'
import FileSystemItem from './FileSystemItem'

/**
 * Checks if the path is a directory
 * @param {String} name Path of the directory
 * @returns {Boolean} True in case the path is a directory, otherwise false
 */
const isDirectory = name => new Promise((resolve, reject) => {
  fs.lstat(name, (err, stats) => {
    if(err !== null)
      return reject(false)

    resolve(stats.isDirectory())
  })
})

/**
 * Reads dir content
 * @param {String} path Path of dir
 * @returns {Array} Array filled with FileSystemItems
 */
const readDir = path => new Promise((resolve, reject) => {
  fs.readdir(path, {withFileTypes: true}, (error, data) => {
    if(error)
      reject(error)

    const content = []

    data.map(async (item, index) => {
      const newPath = `${path}/${item}`
      const isDir = await isDirectory(`${path}/${item}`)
      const size = fs.statSync(newPath).size
      content.push(new FileSystemItem(item, newPath, isDir, size))
      if(index + 1 == data.length) {
        resolve(content)
      }
    })

    if(data.length === 0) resolve(content)
  })
})

/**
 * Creates directory if it not exists.
 * @param {String} path Path of dir
 * @returns {Boolean} Returns true on success
 */
const createDir = path => new Promise((resolve, reject) => {
  fs.mkdir(path, '740', (error, fd) => {
    if(error) {
      if(error.code === 'EEXIST') resolve(true)
      else reject(error)
    } else resolve(true)
  })
})

/**
 * Removes directory from filesystem
 * @param {String} path Path to the directory
 * @returns {Boolean} True when the directory was successfully removed
 */
const removeDir = path => new Promise((resolve, reject) => {
  fs.rmdir(path, error => {
    if(error) reject(error)
    else resolve(true)
  })
})

/**
 * Reads content of file
 * @param {String} path Path to file
 * @returns {String} The content of the file
 */
const readFile = path => new Promise((resolve, reject) => {
  fs.readFile(path, (error, data) => {
    (error) ? reject(error) : resolve(data.toString())
  })
})

/**
 * Creates file. If it already exists, content will be overwritten.
 * @param {String} path Path of dir
 * @param {String} content Content to insert into the file. Defaults to empty string
 * @returns Returns true on success
 */
const createFile = (path, content = '') => new Promise((resolve, reject) => {
  // Overwrite file directly
  fs.writeFile(path, content, {encoding: 'utf8', mode: '740'}, error => {
    if(error) reject(error)
    else resolve(true)
  })
  /*
  fs.open(path, 'r', '740', (error, fd) => {
    if(error) {
      if(error.code === 'ENOENT') {
        // Create file
        fs.writeFile(path, content, {encoding: 'utf8', mode: '740'}, error => {
          if(error) reject(error)
          else resolve(true)
        })
      } else {
        reject(error)
      }
    } else {
      resolve(true)
    }
  })
  */
})

/**
 * Appends content to an existing file.
 * @param {String} path Path to the file
 * @param {String} content Content that should be appended to the file
 * @returns {Boolean} True when appending process succeeded
 */
const appendToFile = (path, content) => new Promise((resolve, reject) => {
  fs.appendFile(path, content, err => {
    if (err) reject(err)
    resolve(true)
  })
})

/**
 * Moves a file to a new destination
 * @param {String} oldPath Old path of the file
 * @param {String} newPath New path of the file
 * @returns {Boolean} True if move finished successfully
 */
const moveFile = (oldPath, newPath) => new Promise((resolve, reject) => {
  fs.rename(oldPath, newPath , err => {
    if(err) reject(err)
    else resolve(true)
  })
})

/**
 * Removes file from filesystem.
 * @param {String} path Path to the file
 * @returns {Boolean} True if file was removed
 */
const removeFile = path => new Promise((resolve, reject) => {
  fs.unlink(path, error => {
    if(error) reject(error)
    else resolve(true)
  })
})

/**
 * Checks if file or directory exists by checking if target is writable.
 * @param {String} path Path of the item
 * @returns {Boolean} True if item exists
 */
const exists = path => new Promise((resolve, reject) => {
  fs.access(path, fs.constants.W_OK, error => ((error) ? reject(error) : resolve(true)))
})

/**
 * Creates minimal directory structure in the filesystem,
 * which is necessary that the application can perform properly.
 * @returns {Boolean} True if structure was created successfully, otherwise false
 */
const createBaseStructure = () =>
  createDir(globals.BASE_PATH).then(result => {
    if(result === true) return createDir(globals.CONFIG_PATH)
    else {
      return false
    }
  }).then(result => {
    if(result === true) return createDir(globals.PERSISTENCE_PATH)
    else {
      return false
    }
  }).catch(error => {console.log(error); return false})

/**
 * Checks if the required base structure is present
 * @returns {Boolean} True when structure is present, otherwise false
 */
const checkFiles = () =>
  exists(globals.BASE_PATH)
    .then(result => {
      if(result === true) {
        return exists(globals.CONFIG_PATH)
      } else return false
    })
    .then(result => {
      if(result === true) {
        return exists(globals.PERSISTENCE_PATH).then(result => result === true)
      } else return false
    }).catch(error => false)

export { readDir, isDirectory, createDir, removeDir, readFile, createFile, appendToFile, removeFile, moveFile, createBaseStructure, exists, checkFiles }
