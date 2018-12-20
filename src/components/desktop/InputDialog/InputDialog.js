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
import PropTypes from 'prop-types'
import {isObjectEmpty} from '../../../utils'

class InputDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }

  state = {
    value: ''
  }

  componentDidMount() {
    const { value } = this.props
    this.setState({value})
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.open === false) {
      this.setState({value: ''})
    } else
      this.setState({value: nextProps.value})
  }

  handleChange = prop => event => this.setState({ [prop]: event.target.value })

  render() {
    const {open, handleClose, title, content, label} = this.props

    return (
      <Dialog
        open={open}
        onClose={() => handleClose('close')}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content}
          </DialogContentText>
          <TextField
            value={this.state.value}
            autoFocus
            margin="dense"
            id="group_name"
            label={label}
            type="text"
            fullWidth
            onChange={this.handleChange('value')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('close')} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleClose(this.state.value)} color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default InputDialog
