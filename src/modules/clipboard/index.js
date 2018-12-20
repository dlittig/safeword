import globals from '../../globals'

let clipboard = ''
if(globals.PLATFORM === 'mobile') {
  clipboard = require('./Clipboard.native')
} else {
  clipboard = require('./Clipboard.desktop')
}

export default clipboard
