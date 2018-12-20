import React from 'react'

import { Dialog, DialogContent, CircularProgress, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  grid: {
    backgroundColor: theme.palette.primary.main
  },
  progress: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.secondary.main
  },
  text: {
    color: theme.palette.secondary.notice
  }
})

const LoadingDialog = ({classes, open}) => (
  <Dialog
    disableBackdropClick
    disableEscapeKeyDown
    maxWidth="xs"
    open={open}
  >
    <DialogContent>
      <CircularProgress className={classes.progress} />
      <Typography className={classes.text}>Syncing...</Typography>
    </DialogContent>
  </Dialog>
)

export default withStyles(styles)(LoadingDialog)
