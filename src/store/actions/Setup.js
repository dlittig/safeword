export const SETUP_COMPLETED = 'SETUP_COMPLETED'
export const SETUP_ERROR = 'SETUP_ERROR'
export const SETUP_CLEAR_ERROR = 'SETUP_CLEAR_ERROR'
export const SETUP_UNCOMPLETED = 'SETUP_UNCOMPLETED'

/**
 * Sets the state of the setup to completed
 */
const complete = () => ({
  type: SETUP_COMPLETED
})

/**
 * Logs an error to the user interface
 * @param {String} error Error text
 */
const error = error => ({
  type: SETUP_ERROR,
  error
})

/**
 * Removes error from store and userinterface
 */
const clearError = () => ({
  type: SETUP_CLEAR_ERROR
})

/**
 * Sets the state of setup to uncompleted
 */
const uncomplete = () => ({
  type: SETUP_UNCOMPLETED
})

export const Setup = {complete, uncomplete, error, clearError}
