import SyncAdapter from './SyncAdapter'
import Webdav from '../../modules/webdav'
import Connectivity from '../../modules/connectivity'
import Sha from '../../modules/sha'
import { Message } from '../../store/actions/Message'
import { store } from '../../store'
import FileSystemItem from '../../modules/filesystem/FileSystemItem'
import globals from '../../globals'
import { DIRECTORY_PREFIX, KEY_PREFIX, ADDITIONAL_PREFIX } from '../../components/core/Sync/parameters'

export default class WebdavAdapter extends SyncAdapter {
  client = null

  static description = 'WebDAV'

  /**
   * @returns Unique identifier of adapter
   */
  describe = () => 'WebDAV'

  /**
   * Validates if the passed credentials can be used for this adapter
   * @param  {Object} parameters Parameters object that should contain url, user and pw
   * @returns True if credentials are valid
   */
  validateCredentials = ({url, user, pw}) => url !== null && url !== '' && user !== null && user !== '' && pw !== null && pw !== ''

  /**
   * Sets Marker of last synchronization to curent timestamp
   */
  setMarker = () => this.pushFile('/sync.info', new Date().getTime().toString())

  /**
   * Fetches marker of last synchronization
   * @returns Stringified numeric timestamp
   */
  getMarker = () => this.pullFile('/sync.info')

  /**
   * Connects to the remote server. Beforehand connectivity checks are being performed.
   * @param {Object} parameters Parameters object that should contain url, user and pw
   * @param {Boolean} checkDirs Flag that indicates if the folder structure on the remote server should be checked
   * @returns True if connection test were successful and a connection to the remote server could be established
   */
  connect = async ({url, user, pw}, checkDirs = true) => {
    console.log(url, user, pw)
    const isOnline = await Connectivity.isConnected()
    if(isOnline === true) {
      const isMobile = await Connectivity.isMobile()
      if(isMobile === false) {
        if(this.client === null) {
          try {
            this.client = Webdav.client(url, user, pw)
          } catch(error) {
            return false
          }
        }
        console.log('connect', 1)
        if(checkDirs) {
          // Prepare safeword dir
          const existsData = await this.pullDir(DIRECTORY_PREFIX)
          if(existsData === null) {
            await this.pushDir(DIRECTORY_PREFIX)
          }
          console.log('connect', 2, existsData)

          // Prepare safeword dir
          const existsAdditional = await this.pullDir(ADDITIONAL_PREFIX)
          if(existsAdditional === null) {
            await this.pushDir(ADDITIONAL_PREFIX)
          }

          // Prepare safeword dir
          const existsKey = await this.pullDir(KEY_PREFIX)
          if(existsKey === null) {
            await this.pushDir(KEY_PREFIX)
          }
          console.log('connect', 3, existsKey)
        }

        return true
      } else {
        return false
      }
    } else {
      store.dispatch(Message.set('Could not connect. Please check your internet connection.'))
      return false
    }
  }


  /**
   * Checks if there is a file collision on the remote server
   * @param  {String} text File contents of the local data
   * @param  {String} path Path to the remote file
   * @param  {Boolean} isNew Flag if the
   * @returns True if collision was detected
   */
  isConflicting = async (text, path, isNew) => {
    if(this.client === null)
      throw 'Client was not created yet'

    console.log(text, path, isNew)

    const content = await this.client.getFileContents(path, {format: 'text'})
    console.log(content)
    if(content === null && isNew) return false
    if(content === null && !isNew) return true
    console.log('before hashing')
    const hash = await Sha.hash256(Buffer.from(text).toString('hex'))
    const remoteHash = await Sha.hash256(Buffer.from(content).toString('hex'))

    console.log(hash, remoteHash)

    return hash !== remoteHash
  }

  /**
   * Pushes file to remote server
   * @param  {String} path Path to file on remote server
   * @param  {String} text Content of the file being pushed
   * @param  {Boolean} remove Flag if file should be removed. Defaults to false
   * @returns True if successful
   */
  pushFile = async (path, text, remove = false) => {
    console.log(text, path)
    if(this.client === null)
      throw 'Client was not created yet'

    if(remove) {
      await this.client.deleteFile(path)
      return true
    } else {
      await this.client.putFileContents(path, text, {format: 'text'})
      return true
    }
  }

  /**
   * Pushes directory to remote server
   * @param  {String} path Path to the directory on remote server
   * @param  {Boolean} remove Flag if directory should be removed. Defaults to false
   * @returns True if successful
   */
  pushDir = async (path, remove = false) => {
    if(this.client === null)
      throw 'Client was not created yet'

    if(remove) {
      await this.client.deleteFile(path)
      return true
    } else {
      await this.client.createDirectory(path).catch(e => console.error(e))
      return true
    }
  }

  /**
   * Pulls file from remote server
   * @param {String} path Path to the file
   * @returns File contents
   */
  pullFile = async path => {
    if(this.client === null)
      throw 'Client was not created yet'

    const content = await this.client.getFileContents(path).catch(() => null)
    if(content === null) return content

    const result = content.toString()
    return result
  }

  /**
   * Pulls directory contents from remote server
   * @param {String} path Path to directory on remote server
   * @returns Map of FileSystemItems with all files and their contents
   */
  pullDir = path => new Promise(async (resolve) => {
    console.log(this.client)
    if(this.client === null)
      throw 'Client was not created yet'

    console.log('pullDir before read')
    const result = await this.client.getDirectoryContents(path).catch(e => null)
    console.log('pullDir after read', result)
    if(result === null) return resolve(null)
    const dir = new Map()

    result.map(async (item, index) => {
      console.log(item, index)
      let content = ''

      // If file read content
      if(item.type === 'file') {
        console.log('file')
        content = await this.pullFile(item.filename)
        console.log(content)
      } else {
        console.log('dir')
        // If dir, get subfolders
        content = await this.pullDir(item.filename)
        console.log(content)
      }
      dir.set(new FileSystemItem(item.basename, item.filename, item.type === 'directory', item.size), content)

      if(index+1 === result.length) {
        console.log('resolving dir')
        resolve(dir)
      }
    })

    if(result.length === 0) resolve(dir)
  })

  /**
   * Pulls all folders and directories from remote server
   * @param {String} key
   * @returns Boolean if pull was successful
   */
  pullAll = async key => {
    if(this.client === null)
      throw 'Client was not created yet'

    // Read all data in DIRECTORY_PREFIX. Create a map and pass it to the adapter, whose job it is to import all the stuff
    const files = await this.pullDir(DIRECTORY_PREFIX)
    const {adapter} = store.getState().persistence
    return await adapter.processFilesOfPullSync(files, true, key)
  }

  /**
   * Pushes all files to the remote server
   */
  pushAll = async () => {
    if(this.client === null)
      throw 'Client was not created yet'

    const {adapter} = store.getState().persistence

    const files = await adapter.collectFilesForPushSync(globals.PERSISTENCE_PATH, true)
    console.log('pushAll', 1, files)
    for (let [key, value] of files) {
      console.log('pushAll', 2, key, value)
      if(key.isDirectory) {
        await this.pushDir(`${DIRECTORY_PREFIX}/${key.name}`)
        // Look into dir
        const dir = value
        for (let [file, content] of dir) {
          console.log('pushAll', 3, file, content)
          await this.pushFile(`${DIRECTORY_PREFIX}/${key.name}/${file.name}`, content)
        }
      } else {
        await this.pushFile(`${DIRECTORY_PREFIX}/${key.name}`, value)
      }
    }
  }

  /*
  webdavToMap = async path => {
    const result = new Map()
    const dir = await this.pullDir(path)
    dir.map(async item => {
      let content = ''

      // If file read content
      if(!item.isDirectory) {
        content = await this.pullFile(item.path)
      } else {
        // If dir, get subfolders
        content = await this.webdavToMap(item.path)
      }

      result.set(item, content)
    })

    return result
  }
  */
}
