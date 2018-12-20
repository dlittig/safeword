import React from 'react'
import AppBar from '../../../components/desktop/AppBar'

import { FormControl, Grid, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grid: {
    width: '100%',
    height: '100vh',
    backgroundColor: theme.palette.primary.main
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  button: {
    margin: theme.spacing.unit,
  }
})

class SetupOrRestore extends React.Component {
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
          <FormControl className={classes.formControl}>
            <Button variant="contained" color="default" className={classes.button} onClick={() => this.changeLocation('/setup/restore')}>Restore from backup</Button>
            <Button variant="contained" color="default" className={classes.button} onClick={() => this.changeLocation('/setup/configure')}>Setup new storage</Button>
          </FormControl>
        </Grid>
      </AppBar>
    )
  }
}

export default withRouter(withStyles(styles)(SetupOrRestore))
