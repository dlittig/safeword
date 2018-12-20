import { createStore, compose, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import reducers from './reducers'
import { AsyncStorage } from 'react-native'

const reducer = combineReducers({ ...reducers })

const persistedReducer = persistReducer({
  key: 'safeword',
  storage: AsyncStorage,
  blacklist: ['setup']
}, reducer)

const initialState = {}

/*
const enhancer = compose(
  //persistState('auth')
)*/

let store = createStore(
  reducer,
  initialState
)

let persistor = persistStore(store)

export { store, persistor }

/*
import { createStore, compose, combineReducers, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import reducers from './reducers'
import storage from 'redux-persist/lib/storage'
import nav from './reducers/nav'
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'

const reducer = combineReducers({
  ...reducers,
  nav
})

const persistedReducer = persistReducer({
  key: 'safeword',
  storage,
  blacklist: ['nav', 'setup']
}, reducer)

const navigation = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
)

const enhancer = compose(
  applyMiddleware(navigation),
//  persistState('auth')
)

const initialState = {}

let store = createStore(
  persistedReducer,
  initialState,
  enhancer
)

let persistor = persistStore(store)

export { store, persistor }
*/
