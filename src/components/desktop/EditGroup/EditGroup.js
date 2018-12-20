import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button
} from '@material-ui/core'
import {isObjectEmpty} from '../../../utils'
import PropTypes from 'prop-types'

class EditGroup extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
  }

  state = {
    name: ''
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {name} = newProps
    if(name !== undefined && name !== null) {
      this.setState({name})
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.open === false && this.props.open !== prevProps.open) {
      this.setState({name: ''})
    }
  }

  handleChange = prop => event => this.setState({ [prop]: event.target.value })

  render() {
    const {open, handleClose, title} = this.props

    return (
      <Dialog
        open={open}
        onClose={handleClose('close')}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the group in the text field below. Submit the name by clicking on "Save".
          </DialogContentText>
          <TextField
            value={this.state.name}
            autoFocus
            margin="dense"
            id="group_name"
            label="Group name"
            type="text"
            fullWidth
            onChange={this.handleChange('name')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose('close')} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleClose(this.state.name)} color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default EditGroup
