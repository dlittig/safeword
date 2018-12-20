import React from 'react'

import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  empty: {
    height: '100%',
    margin: theme.spacing.unit
  },
  emptyText: {
    color: theme.palette.secondary.notice
  }
})

const EmptyState = ({classes, text}) => (
  <Grid
    className={classes.empty}
    container
    direction="row"
    justify="center"
    alignItems="center"
  >
    <p className={classes.emptyText}>{text}</p>
  </Grid>
)

EmptyState.propTypes = {
  text: PropTypes.string.isRequired
}

export default withStyles(styles)(EmptyState)
