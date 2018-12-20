import React from 'react'

import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, FormGroup, Switch, FormControlLabel, withStyles } from '@material-ui/core'
import { isObjectEmpty } from '../../../utils'
import Random from '../../../modules/random'
import PropTypes from 'prop-types'

const styles = theme => ({
  password: {
    '& input' : {
      fontFamily : 'Courier, monospace'
    }
  },
  textField: {
    width: 150
  }
})

class GenerateRandom extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    submitText: PropTypes.string.isRequired,
    descriptionText: PropTypes.string.isRequired
  }

  state = {
    password: '',
    alphaLow: true,
    alphaUp: true,
    num: true,
    special: true,
    length: 32
  }

  componentDidMount() {
    this.generatePassword()
  }

  /**
   * Generates a password with the passed properties and saves it to state
   */
  generatePassword = () => {
    Random.get(this.getCharset(), this.state.length).then(result => {
      this.setState({password: result})
    })
  }

  /**
   * Generates a charset string with the preferences of the user.
   * @returns Charset string
   */
  getCharset = () => {
    let result = ''
    if(this.state.alphaLow === true) result += Random.ALPHA_LOW
    if(this.state.alphaUp === true) result += Random.ALPHA_UP
    if(this.state.num === true) result += Random.NUM
    if(this.state.special === true) result += Random.SPECIAL

    return result
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.open === false) {
      this.setState({password: ''})
    } else if(nextProps.open === true && this.props.open === false) {
      this.generatePassword()
    }
  }

  /**
   * Handle event when the length of the password changes
   */
  handleNumber = prop => event => this.setState({ [prop]: parseInt(event.target.value) }, () => this.generatePassword())

  /**
   * Handle event when one of the toggle switches changes state
   */
  handleToggle = prop => event => this.setState({ [prop]: !this.state[prop]}, () => this.generatePassword())

  /**
   * Handle event when a text field changes its contents
   */
  handleChange = prop => event => this.setState({ [prop]: event.target.value }, () => this.generatePassword())

  /**
   * Handle close event of this component.
   */
  handleClose = props => event => {
    const { handleClose } = this.props
    if(props === 'close') {
      this.setState({
        password: '',
        alphaLow: true,
        alphaUp: true,
        num: true,
        special: true,
        length: 32
      })
    }
    handleClose(props)(event)
  }

  render() {
    const {open, handleClose, classes, submitText, descriptionText} = this.props

    return (
      <Dialog
        open={open}
        onClose={handleClose('close')}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Generate password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Configure the properties of the generated password. {descriptionText}
          </DialogContentText>

          <FormGroup row>
            <TextField
              label="Password length"
              value={this.state.length}
              onChange={this.handleNumber('length')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </FormGroup>

          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.alphaLow}
                  onChange={this.handleToggle('alphaLow')}
                  value="alphaLow"
                />
              }
              label="Alphabetic lowercase"
            />
          </FormGroup>

          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.alphaUp}
                  onChange={this.handleToggle('alphaUp')}
                  value="alphaUp"
                />
              }
              label="Alphabetic uppercase"
            />
          </FormGroup>

          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.num}
                  onChange={this.handleToggle('num')}
                  value="num"
                />
              }
              label="Numeric"
            />
          </FormGroup>

          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.special}
                  onChange={this.handleToggle('special')}
                  value="special"
                />
              }
              label="Special characters"
            />
          </FormGroup>

          <FormGroup row>
            <TextField
              className={classes.password}
              value={this.state.password}
              autoFocus
              margin="dense"
              id="password"
              label="Generated password"
              type="text"
              fullWidth
              onChange={this.handleChange('password')}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose('close')} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.handleClose(this.state.password)} color="secondary">
            {submitText}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withStyles(styles)(GenerateRandom)
