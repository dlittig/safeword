import globals from '../../globals'

let webdav = ''
if(globals.PLATFORM === 'mobile') {
  webdav = require('./Webdav.native')
} else {
  webdav = require('./Webdav.desktop')
}

export default webdav
