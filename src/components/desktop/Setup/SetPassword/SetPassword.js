import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Setup as SetupAction } from '../../../../store/actions/Setup'
import { handleComplete, validatePassword } from '../../../core/Setup'
import AppBar from '../../AppBar'

import { Grid, Button, TextField, FormControl, createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import { Check } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'

const styles = theme => ({
  formItem: {
    width: '40vw'
  }
})

const theme = createMuiTheme({
  palette: {
    primary: green
  },
  typography: {
    useNextVariants: true,
  }
})

class SetPassword extends React.Component {
  state = {
    password: '',
    passwordRepitition: '',
    passwordHasError: false
  }

  static propTypes = {
    password: PropTypes.string.isRequired,
    passwordRepitition: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired
  }

  componentDidMount() {
    const {password, passwordRepitition} = this.props
    this.setState({
      password,
      passwordRepitition
    })
  }

  /**
   * Checks if the repitition matches the first password
   * @returns True if both passwords are equal, otherwise false
   */
  validateRepitition = () => this.state.password === this.state.passwordRepitition

  /**
   * Change passwords in this component and in the parent component
   */
  handleChange = event => {
    const target = event.target.name
    const value = event.target.value
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.props.handleChange(target, value)

      // Show error if password is not valid and password is longer than 0
      this.setState({passwordHasError: !validatePassword(this.state.password) && this.state.password.length > 0})
    })
  }

  render() {
    const {classes} = this.props
    const inputAttributes = { error: this.state.passwordHasError }
    const validated = this.validateRepitition() && this.state.passwordHasError === false && this.state.password !== ''

    return (
      <FormControl>
        <MuiThemeProvider theme={validated ? theme : {}}>
          <TextField
            { ...inputAttributes }
            id="password"
            label="Enter masterpassword"
            className={classes.formItem}
            type="password"
            margin="normal"
            helperText="Password should have at least 16 characters, contain lowercase, uppercase letters, numbers and special characters"
            value={this.state.password}
            onChange={this.handleChange}
            inputProps={{
              name: 'password'
            }}
          />
          <TextField
            id="passwordRepitition"
            label="Repeat masterpassword"
            className={classes.formItem}
            type="password"
            margin="normal"
            value={this.state.passwordRepitition}
            onChange={this.handleChange}
            inputProps={{
              name: 'passwordRepitition'
            }}
          />
        </MuiThemeProvider>
      </FormControl>
    )
  }
}

const mapStateToProps = ({config: {store: configuration}}) => ({configuration})

export default withRouter(withStyles(styles)(connect(mapStateToProps)(SetPassword)))
