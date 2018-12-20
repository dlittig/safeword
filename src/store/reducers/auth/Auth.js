import {
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_OUT
} from '../../actions/Auth'

const initialState = {
  isAuthenticated: false,
  token: null
}

function auth(state = initialState, action) {
  switch (action.type) {
  case SIGN_IN_REQUEST:
    return Object.assign({}, state, {
      isAuthenticated: true
    })
  case SIGN_IN_SUCCESS: {
    const { token } = action
    return Object.assign({}, state, {
      isAuthenticated: false,
      token
    })
  }
  case SIGN_IN_FAILURE:
    return initialState
  case SIGN_OUT:
    return initialState
  default:
    return state
  }
}

export default auth
