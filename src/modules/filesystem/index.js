import globals from '../../globals'

let fs = ''
if(globals.PLATFORM === 'mobile') {
  fs = require('./Filesystem.native')
} else {
  fs = require('./Filesystem.desktop')
}

export default fs
