import Configuration from '../../../configuration'

const initialState = {
  readOnly: new Map(), // Readonly can be used for instant readOnly access
  store: new Configuration()
}

const config = (state = initialState, action) => state

export default config
