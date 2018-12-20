import globals from '../../globals'
import Auth from '../../store/actions/Auth'
import { Settings } from '../../store/actions/Settings'
import { Persistence } from '../../store/actions/Persistence'

let locker = ''
if(globals.PLATFORM === 'mobile') {
  locker = require('./Locker.native')
} else {
  locker = require('./Locker.desktop')
}

const callback = () => {
  const { store } = require('../../store')
  // Destroy adapter connections
  store.getState().persistence.adapter.destroy()
  // Destroy database connections for settings and configuration
  store.getState().settings.store.destroy()
  store.getState().config.store.destroy()
  store.dispatch(Settings.update(new Map()))
  store.dispatch(Persistence.updateGroups([]))
  store.dispatch(Persistence.updatePasswords([]))
  store.dispatch(Auth.logout())
}

export default { ...locker, callback }
