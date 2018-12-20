export const SETTINGS_UPDATE = 'SETTINGS_UPDATE'

/**
 * Updates the read only values of the settings
 * @param {Map} map List of key value pairs
 */
const update = map => ({
  type: SETTINGS_UPDATE,
  readOnly: map
})

export const Settings = { update }
