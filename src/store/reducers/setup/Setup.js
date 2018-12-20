import {
  SETUP_COMPLETED,
  SETUP_UNCOMPLETED,
  SETUP_ERROR,
  SETUP_CLEAR_ERROR
} from '../../actions/Setup'

const initialState = {
  completed: undefined,
  error: null,
}

const setup = (state = initialState, action) => {
  switch(action.type) {
  case SETUP_COMPLETED:
    return Object.assign({}, state, {
      completed: true
    })
  case SETUP_UNCOMPLETED:
    return Object.assign({}, state, {
      completed: false
    })
  case SETUP_ERROR:
    return Object.assign({}, state, {
      error: action.error
    })
  case SETUP_CLEAR_ERROR:
    return Object.assign({}, state, {
      error: null
    })
  default:
    return state
  }
}

export default setup
