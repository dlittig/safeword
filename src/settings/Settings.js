import RxDB from 'rxdb'
import schema from './schema'
import globals from '../globals'
//import { store } from '../store/store.desktop'
import { Settings as SettingsAction } from '../store/actions/Settings'
import { Map } from 'core-js'

// Manages settings
export default class Settings {
  db = null
  adapter = ''

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

  load = async password => {
    // Return existing database if already set up
    if(this.db !== null)
      return this.db.collection({
        name: 'settings',
        schema
      }).catch(err => this.db.settings)

    if(this.adapter === '')
      this._setAdapter()

    const rx = {
      name: 'settings',
      adapter: this.adapter,
      multiInstance: false,
      password
    }

    return RxDB.create(rx).then(async db => {
      this.db = db
      let settings = await this.db.collection({
        name: 'settings',
        schema
      }).catch(err => this.db.settings)

      return this.db.settings
    })
  }

  clean = () => {
    if(this.adapter === '')
      this._setAdapter()

    return RxDB.removeDatabase('settings', this.adapter).then(result => true).catch(err => false)
  }

  destroy = async () => {
    await this.db.destroy()
    this.db = null
    return true
  }

  rebuild = async key => {
    const dump = await this.db.dump()
    await this.destroy()
    await this.clean()
    this.db = null
    await this.load(key)
    this.db.importDump(dump)

    return true
  }

  get = key => this.db.settings.findOne({key}).exec().then(document => document.get('value'))

  set = (key, value) => this.db.settings.upsert({key, value})

  initReadOnly = async () => {
    // Require store in function because earlier the redux store is not prepared
    const {store} = require('../store')
    const map = new Map()
    const items = await this.db.settings.find().exec()
    items.forEach(element => {
      map.set(element.get('key'), element.get('value'))
    })
    store.dispatch(SettingsAction.update(map))
    return true
  }
}
