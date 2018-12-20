export const MESSAGE_SET = 'MESSAGE_SET'
export const MESSAGE_CLEAR = 'MESSAGE_CLEAR'

/**
 * Sets message thet will be displayed in the snackbar
 * @param {String} info Text to display
 */
const set = info => ({
  type: MESSAGE_SET,
  info
})

/**
 * Removes all messages
 */
const clear = () => ({
  type: MESSAGE_CLEAR
})

export const Message = {set, clear}
