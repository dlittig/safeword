require('babel-polyfill')
import RxDB from 'rxdb'
import schema from './schema'
import globals from '../globals'
import fs from '../modules/filesystem'

export default class Configuration {
  db = null
  adapter = ''

  /**
   * Sets adapter to use with RX
   */
  _setAdapter = () => {
    // Create config and require plugins. Is neccessary to do here because otherwise initialization happens to early
    if(globals.PLATFORM === 'desktop') {
      RxDB.plugin(require('pouchdb-adapter-idb'))
      this.adapter = 'idb'
    } else if(globals.PLATFORM === 'mobile') {
      RxDB.plugin(require('pouchdb-adapter-asyncstorage').default)
      this.adapter = 'asyncstorage'
    }
  }

  /**
   * Loads the database or creates an instance, if it does not exists.
   * @param {String} password Password to encrypt/decrypt the data
   */
  load = async (password) => {
    // Return existing database if already set up
    if(this.db !== null)
      return this.db.collection({
        name: 'safeword',
        schema
      }).catch(err => this.db.safeword)

    if(this.adapter === '')
      this._setAdapter()

    const rx = {
      name: 'safeword',
      adapter: this.adapter,
      multiInstance: false,
      password
    }

    return RxDB.create(rx).then(async db => {
      this.db = db
      let safeword = await this.db.collection({
        name: 'safeword',
        schema
      }).catch(err => this.db.safeword)

      return this.db.safeword
    })
  }

  /**
   * Remove any data from the app.
   * @returns True on success, otherwise false
   */
  clean = () => {
    if(this.adapter === '')
      this._setAdapter()

    return RxDB.removeDatabase('safeword', this.adapter).then(result => true).catch(err => false)
  }

  /**
   * Destroy current db instance so that in the end the data of the DB cant be accessed.
   * @returns True on success
   */
  destroy = async () => {
    await this.db.destroy()
    this.db = null
    return true
  }

  /**
   * Rebuilds configuration database by clearing any given data and reimporting
   * the data with a new key
   * @param {String} key New key for encryption
   * @returns True on success
   */
  rebuild = async key => {
    const dump = await this.db.dump()
    await this.destroy()
    await this.clean()
    this.db = null
    await this.load(key)
    this.db.importDump(dump)

    return true
  }

  /**
   * Fetches the configuration row from the database
   * @returns RxDocument which symbolizes the first row
   */
  get = () => this.db.safeword.findOne({id: '0'}).exec()

  /**
   * Saves configuration data
   * @param {String} type Persistence type containing the unique identifier
   * @param {String} path Path to key files
   * @param {Boolean} setFlag If flag file should be created
   */
  set = (type, path, setFlag) => {
    const date = new Date().getTime()
    return this.db.safeword.upsert({id: '0', type, path, created: date}).then(result => {
      if(setFlag) {
        return fs.createFile(`${globals.CONFIG_PATH}/rx.sw`, date)
      }
    }).catch(error => {console.warn(error); return false})
  }

  /**
   * Checks flag file for existence.
   * @returns True when flag file exists.
   */
  isConfigured = () => fs.exists(`${globals.CONFIG_PATH}/rx.sw`).catch(error => false)

  /**
   * Validates flag file and checks if the saved data matches with the timestamp in the database
   * @returns True if configuration is valid. Otherwise false will be returned
   */
  validate = collection => {
    return fs.readFile(`${globals.CONFIG_PATH}/rx.sw`)
      .then(data => collection.findOne({id: '0'}).exec().then(safeword => {console.log(data); return safeword.created == data}))
      .catch(error => {console.log('catch', error); return false})
  }
}
