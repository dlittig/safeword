'use strict'
import gpl from './gpl'

let BASE_PATH = ''

/*
 * This workaround is needed so that react native is not evaluating the `os` and `electron` import
 */
if(process.versions === undefined) {
  //BASE_PATH = `${require('react-native-fs').ExternalStorageDirectoryPath}`
  BASE_PATH = `${require('react-native-fs').DocumentDirectoryPath}`
} else {
  const os = require('os')
  const electron = require('electron')
  BASE_PATH = `${os.homedir()}/.${electron.remote.app.getName()}`
}

const PERSISTENCE_PATH = `${BASE_PATH}/data`
const CONFIG_PATH = `${BASE_PATH}/config`
const PLATFORM = (process.versions !== undefined) ? 'desktop' : 'mobile'
const SETUP_COMPLETED = false
const GPL = gpl

export {
  GPL,
  BASE_PATH,
  PERSISTENCE_PATH,
  CONFIG_PATH,
  PLATFORM,
  SETUP_COMPLETED
}
