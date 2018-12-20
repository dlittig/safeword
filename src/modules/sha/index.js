import globals from '../../globals'

let sha = ''
if(globals.PLATFORM === 'mobile') {
  sha = require('./Sha.native')
} else {
  sha = require('./Sha.desktop')
}

export default sha
