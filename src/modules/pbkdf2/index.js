import globals from '../../globals'

let pbkdf2 = ''
if(globals.PLATFORM === 'mobile') {
  pbkdf2 = require('./Pbkdf2.native')
} else {
  pbkdf2 = require('./Pbkdf2.desktop')
}

export default pbkdf2
