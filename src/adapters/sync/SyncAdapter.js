export default class SyncAdapter {

  /**
   * Validates if the passed credentials can be used for this adapter
   * @param  {Object} parameters Parameters object that should contain url, user and pw
   * @returns True if credentials are valid
   */
  validateCredentials = ({url, user, pw}) => true

  /**
   * Sets Marker of last synchronization to curent timestamp
   */
  setMarker = () => {}

  /**
   * Fetches marker of last synchronization
   * @returns Stringified numeric timestamp
   */
  getMarker = () => {}

  /**
   * Connects to the remote server. Beforehand connectivity checks are being performed.
   * @param {Object} parameters Parameters object that should contain url, user and pw
   * @param {Boolean} checkDirs Flag that indicates if the folder structure on the remote server should be checked
   * @returns True if connection test were successful and a connection to the remote server could be established
   */
  connect = async ({url, user, pw}, checkDirs = true) => true


  /**
   * Checks if there is a file collision on the remote server
   * @param  {String} text File contents of the local data
   * @param  {String} path Path to the remote file
   * @param  {Boolean} isNew Flag if the
   * @returns True if collision was detected
   */
  isConflicting = async (text, path, isNew) => false

  /**
   * Pushes file to remote server
   * @param  {String} path Path to file on remote server
   * @param  {String} text Content of the file being pushed
   * @param  {Boolean} remove Flag if file should be removed. Defaults to false
   * @returns True if successful
   */
  pushFile = async (path, text, remove = false) => true

  /**
   * Pushes directory to remote server
   * @param  {String} path Path to the directory on remote server
   * @param  {Boolean} remove Flag if directory should be removed. Defaults to false
   * @returns True if successful
   */
  pushDir = async (path, remove = false) => true

  /**
   * Pulls file from remote server
   * @param {String} path Path to the file
   * @returns File contents
   */
  pullFile = async path => ''
  /**
   * Pulls directory contents from remote server
   * @param {String} path Path to directory on remote server
   * @returns Promise that result to a Map of FileSystemItems with all files and their contents
   */
  pullDir = path => new Promise(async (resolve) => new Map())

  /**
   * Pulls all folders and directories from remote server
   * @param {String} key
   * @returns Boolean if pull was successful
   */
  pullAll = async key => true

  /**
   * Pushes all files to the remote server
   */
  pushAll = async () => {}
}
