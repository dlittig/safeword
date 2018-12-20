import { PermissionsAndroid } from 'react-native'

const permissions = [
  {
    type : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    title: 'Read storage',
    message: 'Safeword needs access to the external storage to read and save your passwords.'
  },
  {
    type : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    title: 'Write storage',
    message: 'Safeword needs access to the external storage to read and save your passwords.'
  },
]

const GRANTED = 'granted'

/**
 * Requests permissions to write and read on filesystem
 */
const requestPermissions = () =>
  PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE])
    .then(permissions => permissions[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === GRANTED && permissions[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === GRANTED)
    .catch(error => false)

export { requestPermissions }
