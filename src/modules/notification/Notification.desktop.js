import { guessTypeFromString } from '../../utils'
import { store } from '../../store/store.desktop'
import SettingsParameters from '../../settings/params'

/**
 * Spawns a notification on OS level.
 * @param {String} text The text of the notification
 */
export const set = async text => {
  const enabled = isEnabled()
  if(enabled === true) {
    new Notification('Safeword', {
      body: text,
      lang: 'en-US',
      dir: 'ltr'
    })
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
