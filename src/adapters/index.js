import {FingerprintAdapter, NfcAdapter} from './authentication'
import {CsvAdapter} from './importExport'
import {OpenpgpAdapter, RxAdapter} from './persistence'
import {WebdavAdapter} from './sync'

// Register available modules / adapters to be available in the app
const authenticationAdapters = [
  new FingerprintAdapter(),
  new NfcAdapter()
]

const importExportAdapters = [
  new CsvAdapter()
]

const persistenceAdapters = [
  new OpenpgpAdapter(),
  new RxAdapter()
]

const syncAdapters = [
  new WebdavAdapter()
]

export {authenticationAdapters, importExportAdapters, persistenceAdapters, syncAdapters}
