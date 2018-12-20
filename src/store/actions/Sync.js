export const SYNC_SET_ADAPTER    = 'SYNC_SET_ADAPTER'
export const SYNC_RESET_ADAPTER  = 'SYNC_RESET_ADAPTER'

/**
 * Sets the used adapter for syncing
 * @param {Object} adapter Adapter instance
 */
const set = adapter => ({
  type: SYNC_SET_ADAPTER,
  adapter
})

/**
 * Resets the currently set adapter
 */
const reset = () => ({ type: SYNC_RESET_ADAPTER })

export const Sync = { set, reset }
