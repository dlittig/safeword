import { createStore, compose, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import reducers from './reducers'
import storage from 'redux-persist/lib/storage'

const reducer = combineReducers({ ...reducers })

const persistedReducer = persistReducer({
  key: 'safeword',
  storage,
  blacklist: ['setup']
}, reducer)

const initialState = {}

/*
const enhancer = compose(
  //persistState('auth')
)
*/

let store = createStore(
  reducer,
  initialState
)

let persistor = persistStore(store)

export { store, persistor }
