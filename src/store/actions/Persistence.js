export const PERSISTENCE_SET_ADAPTER    = 'PERSISTENCE_SET_ADAPTER'
export const PERSISTENCE_RESET_ADAPTER  = 'PERSISTENCE_RESET_ADAPTER'
export const PERSISTENCE_UPDATE_PW      = 'PERSISTENCE_UPDATE_PW'
export const PERSISTENCE_UPDATE_GRP     = 'PERSISTENCE_UPDATE_GRP'

/**
 * Sets the used adapter for persistence
 * @param {Object} adapter Adapter instance
 */
const set = adapter => ({
  type: PERSISTENCE_SET_ADAPTER,
  adapter
})

/**
 * Resets the currently set adapter
 */
const reset = () => ({ type: PERSISTENCE_RESET_ADAPTER })

/**
 * Updates the passwords saved in the store
 * @param {Array} passwords The changed list of passwords
 */
const updatePasswords = passwords => ({
  type: PERSISTENCE_UPDATE_PW,
  passwords
})

/**
 * Updates the groups saved in the store
 * @param {Array} groups The changed list of groups
 */
const updateGroups = groups => ({
  type: PERSISTENCE_UPDATE_GRP,
  groups
})

export const Persistence = { set, reset, updatePasswords, updateGroups }
