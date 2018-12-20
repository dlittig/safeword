import {
  MESSAGE_SET,
  MESSAGE_CLEAR
} from '../../actions/Message'

const initialState = {
  info: null
}

const message = (state = initialState, action) => {
  switch(action.type) {
  case MESSAGE_SET:
    return Object.assign({}, state, {
      info: action.info
    })
  case MESSAGE_CLEAR:
    return Object.assign({}, state, {
      info: null
    })
  default:
    return state
  }
}

export default message
