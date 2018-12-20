import React from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'
import PropTypes from 'prop-types'

const ConfirmDialog = ({open, handleCancel, title, message, handleAccept}) => (
  <div>
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAccept} color="secondary" autoFocus>
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  </div>
)

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleAccept: PropTypes.func.isRequired
}

export default ConfirmDialog
