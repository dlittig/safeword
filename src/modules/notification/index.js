import globals from '../../globals'

let notification = ''
if(globals.PLATFORM === 'mobile') {
  notification = require('./Notification.native')
} else {
  notification = require('./Notification.desktop')
}

export default notification
