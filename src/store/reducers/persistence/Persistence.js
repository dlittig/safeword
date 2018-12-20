import {
  PERSISTENCE_SET_ADAPTER,
  PERSISTENCE_RESET_ADAPTER,
  PERSISTENCE_UPDATE_PW,
  PERSISTENCE_UPDATE_GRP
} from '../../actions/Persistence'

const initialState = {
  adapter: null,
  passwords: [],
  groups: []
}

function persistence(state = initialState, action) {
  switch (action.type) {
  case PERSISTENCE_SET_ADAPTER:
    return Object.assign({}, state, {
      adapter: action.adapter
    })
  case PERSISTENCE_UPDATE_PW:
    return Object.assign({}, state, {
      passwords: action.passwords
    })
  case PERSISTENCE_UPDATE_GRP:
    return Object.assign({}, state, {
      groups: action.groups
    })
  case PERSISTENCE_RESET_ADAPTER:
    return initialState
  default:
    return state
  }
}

export default persistence
