import React from 'react'
import { Button } from '@material-ui/core'
import AppBar from '../../../components/desktop/AppBar'
import SyncComponent from '../../../components/desktop/Sync'
import ConfirmDialog from '../../../components/desktop/ConfirmDialog'
import LoadingDialog from '../../../components/desktop/LoadingDialog'
import InputDialog from '../../../components/desktop/InputDialog'
import SettingsParameters from '../../../settings/params'
import { start, init } from '../../../components/core/Sync'
import { hydrate } from '../../../components/core/LoginForm'
import { withStyles } from '@material-ui/core/styles'
import { Sync as SyncIcon } from '@material-ui/icons'
import { connect } from 'react-redux'
import { guessTypeFromString } from '../../../utils'

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 5,
    right: theme.spacing.unit * 5
  }
})

class Sync extends React.Component {
  state = {
    confirmOpen: false,
    loadingOpen: false,
    passwordOpen: false,
    decryptPassword: ''
  }

  openPasswordInput = () => this.setState({
    passwordOpen: true,
    confirmOpen: false
  })

  handleCancel = () => this.setState({confirmOpen: false})

  onSync = async () => {
    this.setState({loadingOpen: true})

    // Check if sync has ever been started
    // TODO: syncAdapter is not available here when just enabled
    const {settingsReadOnly, settings} = this.props
    const syncedDeviceBefore = settingsReadOnly.get(SettingsParameters.SYNC_PERFORMED) || false

    const syncAdapter = await init()
    if(syncAdapter === null) return false

    // Check if a copy is on the server
    const copyExistsOnServer = await syncAdapter.getMarker() || false
    console.log('copy exists', copyExistsOnServer, syncedDeviceBefore)

    if(syncedDeviceBefore && copyExistsOnServer) {
      // Already synced
      start(true, false, settings, this.state.decryptPassword, async () => {
        // Rehydrate data
        syncAdapter.cleanPasswordState()
        syncAdapter.cleanGroupState()
        await hydrate()
        this.setState({loadingOpen: false})
      })
    } else if(!syncedDeviceBefore && copyExistsOnServer) {
      // Never synced but copy on server
      this.setState({confirmOpen: true, loadingOpen: false})
    } else if(!syncedDeviceBefore && !copyExistsOnServer) {
      // Never synced no copy on server
      start(false, true, settings, this.state.decryptPassword, async () => {
        // Rehydrate data
        syncAdapter.cleanPasswordState()
        syncAdapter.cleanGroupState()
        await hydrate()
        this.setState({loadingOpen: false})
      })
    }
  }

  handleClose = prop => value => {
    if(value !== 'close') {
      this.setState({[prop]: value}, () => {
        // Never synced but copy on server
        this.setState({loadingOpen: true})
        const {settings} = this.props
        start(true, true, settings, this.state.decryptPassword, () => this.changeLocation('/login'))
      })
    }
  }

  changeLocation = (path, props) => this.props.history.replace(path)

  render() {
    const {classes} = this.props

    return (
      <AppBar
        withGrid
        backButton
        name="Synchronization"
      >
        <SyncComponent />

        <InputDialog
          open={this.state.passwordOpen}
          value={this.state.decryptPassword}
          handleClose={this.handleClose('decryptPassword')}
          title="Password"
          content="Please enter the password used to encrypt the remotely stored passwords."
          label="Password"
        />

        <ConfirmDialog
          title="Start synchronization"
          message="On the server was found a previously created copy of safeword. If you proceed with the sync all locally saved passwords will be deleted."
          handleCancel={this.handleCancel}
          handleAccept={this.openPasswordInput}
          open={this.state.confirmOpen}
        />

        <LoadingDialog open={this.state.loadingOpen} />

        <Button
          variant="fab"
          className={classes.fab}
          color="secondary"
          onClick={() => this.onSync().catch(e => console.warn(e))}
        >
          <SyncIcon />
        </Button>
      </AppBar>
    )
  }
}

const mapStateToProps = ({settings: {readOnly: settingsReadOnly}, settings: {store: settings}, sync: {adapter: syncAdapter}}) => ({settingsReadOnly, settings, syncAdapter})

export default connect(mapStateToProps)(withStyles(styles)(Sync))
