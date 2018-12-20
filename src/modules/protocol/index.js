import globals from '../../globals'
import { store } from '../../store/store.desktop'
import SettingsParameters from '../../settings/params'
import { guessTypeFromString } from '../../utils'

let protocol = ''
if(globals.PLATFORM === 'mobile') {
  protocol = require('./Protocol.native')
} else {
  protocol = require('./Protocol.desktop')
}

const isEnabled = () => {
  const enabled = store.getState().settings.readOnly.get(SettingsParameters.LOGGING_ENABLED)
  if(enabled !== null && enabled !== undefined) {
    return guessTypeFromString(enabled)
  }

  return true
}

const log = successful => {
  console.log(protocol)
  if(isEnabled() === true) {
    protocol.write(successful)
  }
}

export default { log }
