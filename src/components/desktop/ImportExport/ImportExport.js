import React from 'react'

import { Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { KeyboardArrowRight } from '@material-ui/icons'
import AppSubBar from '../AppSubBar'

const style = () => ({
  list: {
    padding: 0
  },
  listItem: {
    paddingLeft: 0,
    borderBottom: '1px solid lightgrey',
    '&:last-of-type': {
      border: 'none !important'
    }
  }
})

class ImportExport extends React.Component {
  render() {
    const { classes } = this.props

    return (
      <Grid>
        <AppSubBar />
        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="Import"
              secondary="Import passwords and groups"
            />
            <ListItemSecondaryAction>
              <IconButton aria-label="Change" onClick={() => {}}>
                <KeyboardArrowRight />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="Export"
              secondary="Export passwords and groups"
            />
            <ListItemSecondaryAction>
              <IconButton aria-label="Change" onClick={() => {}}>
                <KeyboardArrowRight />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Grid>
    )
  }
}

export default withStyles(style)(ImportExport)
