import fs from '../modules/filesystem'
import FileSystemItem from '../modules/filesystem/FileSystemItem'

/**
 * Checks if object is empty
 * @param {Object} obj
 * @returns True if object is empty
 */
export const isObjectEmpty = obj => {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false
  }
  return true
}

/**
 * Searches for key and value in array. Returns null or the object if found.
 * @param {Array} array Array to search in
 * @param {String} key Key that identifies the attribute
 * @param {*} value Value of the key attribute
 * @returns The found object, otherwise null
 */
export const arrayHasObject = (array, key, value) => {
  let result = null
  array.map(item => {
    if(item[key] == value) result = item
  })
  return result
}

/**
 * Searches for key and value in array. Returns the index of the found object
 * @param {*} array Array to search in
 * @param {*} key Key that identifies the attribute
 * @param {*} value Value of the key attribute
 * @return Index of the object in array
 */
export const getKeyOfObjectInArray = (array, key, value) => {
  let result = -1
  array.map((item, index) => {
    if(item[key] == value) result = index
  })
  return result
}

/**
 * Converts a byte array to hex string
 * @param {Array} byteArray Array to serialize
 * @returns {String} Serialized array as string
 */
export const byteArrayToHexString = byteArray =>
  Array.from(byteArray, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('')

/**
 * Tries to guess the type of the data contained in the string
 * @param {String} value Value
 * @returns Guessed value
 */
export const guessTypeFromString = value => {
  if(typeof value !== 'string') return value

  const regex = /^\d*(\.\d+){0,1}/g
  const evaluated = value.match(regex)

  // Check if string could be a digit
  if(evaluated.length === 1 && evaluated[0].length === value.length) {
    // Is a number or a float
    return parseFloat(value)
  }

  if(value === 'true' || value === 'false') {
    return value === 'true'
  }

  return value
}

/**
 * Creates a map of files and directories.
 * @param {String} path The path to create a map of
 * @returns Map with FileSystemItems
 */
export const fsToMap = path => new Promise(async (resolve, reject) => {
  const result = new Map()
  const dir = await fs.readDir(path)
  console.log(path, dir)
  dir.map(async (item, index) => {
    let content = ''

    // If file read content
    if(!item.isDirectory) {
      content = await fs.readFile(item.path)
    } else {
      // If dir, get subfolders
      content = await fsToMap(item.path)
    }

    result.set(item, content)

    if(index+1 === dir.length)
      resolve(result)
  })

  if(dir.length === 0) resolve(result)
})

/**
 * Transforms a normal name to a filename by replacing invalid characters
 * @param {String} name
 * @returns Valid file name
 */
export const nameToFileName = name => name.replace(/\s+/g, '_')
