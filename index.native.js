// Shims
if(typeof global.self === "undefined") global.self = global
// eslint-disable-next-line
window.eval = global.eval = function () {
  throw new Error(`Sorry, this app does not support window.eval().`)
}

import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'])

import 'core-js/es6'
import { AppRegistry } from 'react-native'
import App from './src/app.native'

AppRegistry.registerComponent('safeword', () => App)
