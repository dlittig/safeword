import globals from '../globals'

let redux = null
if(globals.PLATFORM === 'mobile') {
  redux = require('./store.native')
} else {
  redux = require('./store.desktop')
}
const { store } = redux

export { store }

/*
redux = require('./store.desktop')
const {store} = redux
export {store}
*/
