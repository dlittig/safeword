import Settings from '../../../settings'
import { SETTINGS_UPDATE } from '../../actions/Settings'

const initialState = {
  readOnly: new Map(), // Readonly can be used for instant readOnly access
  store: new Settings()
}

const settings = (state = initialState, action) => {
  switch(action.type) {
  case SETTINGS_UPDATE:
    return Object.assign({}, state, {readOnly: action.readOnly})
  default: return state
  }
}

export default settings
