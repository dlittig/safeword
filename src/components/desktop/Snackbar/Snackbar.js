import React from 'react'
import { connect } from 'react-redux'

import { Setup as SetupAction } from '../../../store/actions/Setup'
import { Snackbar as SnackBar } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Message } from '../../../store/actions/Message'

const styles = theme => ({
  snackbar: {
    margin: theme.spacing.unit,
  }
})

class Snackbar extends React.Component {
  state = {
    open : false
  }

  componentDidUpdate(prevProps) {
    const {setup : {error: prevError}, info: prevInfo} = prevProps
    const {setup: {error}, info, dispatch} = this.props
    if(error !== null && prevError !== error)
      this.setState({open: true}, () => {
        setTimeout(() => {
          this.setState({open: false})
          dispatch(SetupAction.clearError())
        }, 4000)
      })

    if(info !== null && prevInfo !== info)
      this.setState({open: true}, () => {
        setTimeout(() => {
          this.setState({open: false})
          dispatch(Message.clear())
        }, 4000)
      })
  }

  getText = () => this.props.setup.error || this.props.info

  render() {
    const {classes} = this.props

    return (
      <SnackBar
        className={classes.snackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.open}
        message={<span>{this.getText()}</span>}
      />
    )
  }
}

const mapStateToProps = ({setup, message: {info}}) => ({setup, info})
export default withStyles(styles)(connect(mapStateToProps)(Snackbar))
