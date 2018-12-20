export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST'
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS'
export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE'
export const SIGN_OUT        = 'SIGN_OUT'

const parseResponse = (action, state, response) => {
  return response.json().then(data => ( { ...data } ))
}

/**
 * Log the user in
 */
const login = () => ({
  type: SIGN_IN_SUCCESS,
  token: 'randomtokenforunknownporpuses'
})

/**
 * Log the user out
 */
const logout = () => ({ type: SIGN_OUT })

const Auth = { login, logout }

export default Auth
