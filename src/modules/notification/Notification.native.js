import { NativeModules } from 'react-native'
import SettingsParameters from '../../settings/params'
import { store } from '../../store/store.desktop'
import { guessTypeFromString } from '../../utils'

const Notification = NativeModules.NotificationModule

/**
 * Spawns a notification on OS level.
 * @param {String} text The text of the notification
 */
export const set = async text => {
  const enabled = isEnabled()
  if(enabled === true) {
    Notification.notify('Safeword', text)
  }
}

/**
 * Checks the settings storage if notifications are enabled.
 * @returns True if enabled, false if disabled
 */
const isEnabled = () => {
  const enabled = store.getState().settings.readOnly.get(SettingsParameters.NOTIFICATIONS_ENABLED)
  if(enabled !== undefined && enabled !== null) {
    return guessTypeFromString(enabled)
  }

  return true
}
