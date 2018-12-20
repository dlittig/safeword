import React from 'react'

import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { AppBar as MaterialAppBar, Toolbar, Typography, Grid, IconButton } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute'
  },
  toolbar: theme.mixins.toolbar,
  content: {
    overflowY: 'auto',
    flexGrow: 1,
    marginTop: '64px',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  bar: {
    boxShadow: 'none'
  },
  backButton: {
    marginLeft: -12,
    marginRight: 20,
  },
})

class AppBar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool,
    withGrid: PropTypes.bool,
    backButton: PropTypes.bool
  }

  goBack = () => this.props.history.goBack()

  render() {
    const { classes, theme, name } = this.props

    return (
      <div className={classes.root}>
        <MaterialAppBar className={classNames(classes.appBar, (this.props.fullScreen) ? classes.bar : '')} position="static">
          <Toolbar>
            { (this.props.backButton === true) && (
              <IconButton className={classes.backButton} onClick={() => this.goBack()} color="inherit" aria-label="Back">
                <ArrowBack />
              </IconButton>
            )}
            <Typography variant="h6" color="inherit" noWrap>
              {name || 'Safeword'}
            </Typography>
          </Toolbar>
        </MaterialAppBar>
        {
          (this.props.fullScreen !== true) ? (
            <main className={classes.content}>
              {/*<div className={classes.toolbar} />*/}
              {this.props.children}
            </main>
          ) : (
            (this.props.withGrid === true) ? (
              <Grid
                container
                className={classes.content}
              >
                { this.props.children }
              </Grid>
            ) : (
              this.props.children
            )
          )
        }
      </div>
    )
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(AppBar))
