import globals from '../../globals'

let aes = ''
if(globals.PLATFORM === 'mobile') {
  aes = require('./Aes.native')
} else {
  aes = require('./Aes.desktop')
}

export default aes
