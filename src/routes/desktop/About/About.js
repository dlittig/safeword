import React from 'react'

import Navigation from '../../../components/desktop/Navigation'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { KeyboardArrowRight } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'

const style = theme => ({
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

class About extends React.Component {

  changeLocation = path => this.props.history.push(path)

  render() {
    const { classes } = this.props

    return (
      <Navigation name="About">
        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="Developer"
              secondary="David Littig, 2018"
            />
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="License"
              secondary="Show license under which Safeword was released"
            />
            <ListItemSecondaryAction>
              <IconButton aria-label="Change" onClick={() => this.changeLocation('/about/license')}>
                <KeyboardArrowRight />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Navigation>
    )
  }
}

export default withRouter(withStyles(style)(About))
