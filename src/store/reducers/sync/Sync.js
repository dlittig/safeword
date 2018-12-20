import {
  SYNC_SET_ADAPTER,
  SYNC_RESET_ADAPTER
} from '../../actions/Sync'

const initialState = {
  adapter: null
}

const sync = (state = initialState, action) => {
  switch(action.type) {
  case SYNC_SET_ADAPTER:
    console.log(SYNC_SET_ADAPTER, action.adapter)
    return Object.assign({}, state, {
      adapter: action.adapter
    })
  case SYNC_RESET_ADAPTER:
    return initialState
  default:
    return state
  }
}

export default sync
