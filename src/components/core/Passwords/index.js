export const EMPTY_TEXT_ALL = 'No passwords saved so far. Create a few with the plus button.'
export const EMPTY_TEXT_RECENT = 'No recently used or created passwords. Create a few with the plus button.'
export const EMPTY_TEXT_EMPTY_GROUP = 'No password has been added to this group.'

/**
 * Fetches the text that should be displayed in the empty text box.
 * @param {String} mode One of 'recent', 'all', 'filter'
 * @returns Matching string
 */
export const getEmptyText = mode => {
  if(mode === 'recent')
    return EMPTY_TEXT_RECENT
  else if(mode === 'all')
    return EMPTY_TEXT_ALL
  else if(mode === 'filter')
    return EMPTY_TEXT_EMPTY_GROUP
  else return ''
}
