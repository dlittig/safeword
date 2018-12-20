import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AppBar from '../../../components/desktop/AppBar/AppBar'
import { Setup as SetupAction } from '../../../store/actions/Setup'
import { Grid, CircularProgress, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import fs from '../../../modules/filesystem'

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

class Loading extends React.Component {
  componentDidUpdate(oldProps) {
    const { navigation, completed } = this.props
    if(completed === true && oldProps.completed !== completed) {
      console.log('change to login')
      this.changeLocation('/login')
    } else if(completed === false && oldProps.completed !== completed) {
      console.log('change to setup')
      this.changeLocation('/setup')
    }
  }

  componentDidMount() {
    const { dispatch, config } = this.props
    fs.checkFiles().then(result => {
      if(result === true) {
        config.isConfigured().then(result => {
          (result === true) ? dispatch(SetupAction.complete()) : dispatch(SetupAction.uncomplete())
        })
      } else {
        dispatch(SetupAction.uncomplete())
      }
    }).catch(error => {
      dispatch(SetupAction.uncomplete())
    })
  }

  changeLocation = path => this.props.history.push(path)

  render() {
    const { classes } = this.props
    return (
      <AppBar fullScreen>
        <Grid
          container
          className={classes.grid}
          alignItems="center"
          direction="row"
          justify="center"
        >
          <CircularProgress className={classes.progress} />

          <Typography className={classes.text}>Starting Safeword...</Typography>
        </Grid>
      </AppBar>
    )
  }
}

const mapStateToProps = ({setup: {completed}, config: {store: config}}) => ({completed, config})

export default withStyles(styles)(withRouter(connect(mapStateToProps)(Loading)))
