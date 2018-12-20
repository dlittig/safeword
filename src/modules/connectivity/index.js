import globals from '../../globals'

let connectivity = ''
if(globals.PLATFORM === 'mobile') {
  connectivity = require('./Connectivity.native')
} else {
  connectivity = require('./Connectivity.desktop')
}

export default connectivity
