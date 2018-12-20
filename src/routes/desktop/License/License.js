import React from 'react'

import AppBar from '../../../components/desktop/AppBar'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { KeyboardArrowRight } from '@material-ui/icons'
import globals from '../../../globals'

const style = theme => ({
  code: {
    fontFamily : 'Courier, monospace',
    margin: 0
  },
})

const License = ({classes}) => {
  return (
    <AppBar backButton name='License' withGrid>
      <pre className={classes.code}>
        {globals.GPL}
      </pre>
    </AppBar>
  )
}

export default withStyles(style)(License)
