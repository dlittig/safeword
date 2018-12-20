import React from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { TextField, FormControl, Button, Grid } from '@material-ui/core'
import Check from '@material-ui/icons/Check'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'

import store from '../../../store/store.desktop'
import Auth from '../../../store/actions/Auth'
import { Setup } from '../../../store/actions/Setup'
import { login, hydrate } from '../../core/LoginForm'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 300,
    marginTop: '-64px'
  },
  grid: {
    width: '100%',
    height: '100vh',
    backgroundColor: theme.palette.primary.main,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 5,
    right: theme.spacing.unit * 5
  }
})

class LoginForm extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    classes: PropTypes.object.isRequired
  }

  state = {
    password: ''
  }

  /**
   * Captures the enter event, that should trigger the login process
   */
  captureEnter = event => {
    if(event.keyCode === 13) {
      event.preventDefault()
      event.stopPropagation()
      this.handleLogin(this.state.password)()
    }
  }

  /**
   * Handle password change
   */
  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value })
  }

  /**
   * Starts the login process, if a password was entered.
   */
  handleLogin = prop => event => {
    const { config, settings, dispatch } = this.props

    if(prop === '') {
      // Display error
      dispatch(Setup.error('Please enter a password.'))
      return null
    }

    login(prop, config, settings, this.props.history).then(result => {
      if(result === true) {
        return hydrate()
      } else if(result === false) {
        // Display error
        dispatch(Setup.error('Safeword failed to unlock. Please reenter the password.'))
        return null
      }
    })
      .then(result => {
        if(result !== null) {
          dispatch(Auth.login('username', 'password'))
          this.changeLocation('/passwords/recent')
        }
      })
      .catch(error => console.log('catched error', error))
  }

  changeLocation = path => this.props.history.push(path)

  render() {
    const { classes } = this.props

    return (
      <Grid
        container
        className={classes.grid}
        alignItems="center"
        direction="row"
        justify="center"
      >
        <FormControl className={classNames(classes.margin, classes.textField)}>
          <TextField
            id="password"
            label="Enter masterpassword..."
            type="password"
            margin="normal"
            value={this.state.password}
            onChange={this.handleChange('password')}
            onKeyUp={this.captureEnter}
          />
        </FormControl>

        <Button
          variant="fab"
          className={classes.fab}
          color="secondary"
          onClick={this.handleLogin(this.state.password)}
        >
          <Check />
        </Button>
      </Grid>
    )
  }
}

const mapStateToProps = ({config: {store: config}, settings: {store: settings}}) => ({config, settings})

export default withRouter(
  withStyles(
    styles, { withTheme: true }
  )(connect(mapStateToProps)(LoginForm)))
