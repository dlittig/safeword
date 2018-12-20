import globals from '../../globals'

let openpgp = ''
if(globals.PLATFORM === 'mobile') {
  openpgp = require('./Openpgp.native').default
} else {
  openpgp = require('./Openpgp.desktop').default
}

//console.log(openpgp)

export default {...openpgp}
