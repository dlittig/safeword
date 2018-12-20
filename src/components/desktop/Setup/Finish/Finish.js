import React from 'react'
import { Grid, Button, CircularProgress } from '@material-ui/core'
import { PhonelinkLock } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const style = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.secondary.main
  },
  grid: {
    display: 'grid',
    justifyItems: 'center'
  }
})

class Finish extends React.Component {
  static propTypes = {
    onStart: PropTypes.func.isRequired
  }

  state = {
    loading: false
  }

  click = () => {
    const {onStart} = this.props
    this.setState({loading: true}, () => onStart())
  }

  render() {
    const {classes} = this.props
    const disabled = { disabled: this.state.loading }

    return (
      <Grid className={classes.grid}>
        {(this.state.loading) && <CircularProgress className={classes.progress} />}

        <Button {...disabled} variant="extendedFab" color="secondary" aria-label="Start using Safeword" onClick={this.click}>
          <PhonelinkLock />&nbsp;&nbsp;Start using Safeword
        </Button>
      </Grid>
    )
  }
}

export default withStyles(style)(Finish)
