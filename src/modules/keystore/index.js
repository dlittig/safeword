import globals from '../../globals'

let keystore = ''
if(globals.PLATFORM === 'mobile') {
  keystore = require('./Keystore.native')
} else {
  keystore = require('./Keystore.desktop')
}

export default keystore
