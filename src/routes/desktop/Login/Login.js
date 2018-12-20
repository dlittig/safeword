import React from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '../../../components/desktop/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import LoginForm from '../../../components/desktop/LoginForm'

const styles = {
  root: {
    flexGrow: 1,
  }
}

const Login = (props) => {
  const { classes } = props
  return (
    <div className={classes.root}>
      <AppBar fullScreen>
        <LoginForm />
      </AppBar>
    </div>
  )
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Login)
