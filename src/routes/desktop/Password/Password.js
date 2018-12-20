import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import Check from '@material-ui/icons/Check'
import { withStyles } from '@material-ui/core/styles'

import AppBar from '../../../components/desktop/AppBar'
import EditPassword from '../../../components/desktop/EditPassword'
import PasswordModel from '../../../model/Password'
import { Message as MessageAction } from '../../../store/actions/Message'
import { savePassword } from '../../../components/core/Password'
import { isObjectEmpty, nameToFileName, guessTypeFromString } from '../../../utils'
import SettingsParameters from '../../../settings/params'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  grid: {
    width: '100%'
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 5,
    right: theme.spacing.unit * 5
  }
})

class Password extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  state = {
    model : {},
    type: 'edit'
  }

  UNSAFE_componentWillMount() {
    const {model} = this.props.location.state
    let oldModel = {}

    if(!isObjectEmpty(model)) {
      oldModel = model.clone()
      oldModel.group = oldModel.group.clone()
    }

    this.setState({
      oldModel,
      model,
      type: isObjectEmpty(model) ? 'new' : 'edit'
    })
  }

  /**
   * Saves the password. If sync is enabled a sync is being performed.
   */
  onSave = async () => {
    // Before saving check if file could be saved
    const {syncAdapter, settingsReadOnly, persistence: {adapter}, dispatch} = this.props
    const {model, type, oldModel} = this.state

    //const syncEnabled = settingsReadOnly.get(SettingsParameters.SYNC_ADAPTER) !== null && settingsReadOnly.get(SettingsParameters.SYNC_ADAPTER) !== ''
    const syncEnabled = false

    if(syncEnabled) {
      // Get paramters to connect to webdav server
      const protocol = guessTypeFromString(settingsReadOnly.get(SettingsParameters.WEBDAV_HTTPS)) === true ? 'https://' : 'http://'
      const url = `${protocol}${settingsReadOnly.get(SettingsParameters.WEBDAV_URL)}`
      const user = settingsReadOnly.get(SettingsParameters.WEBDAV_USERNAME)
      const pw = settingsReadOnly.get(SettingsParameters.WEBDAV_PASSWORD)

      const success = await syncAdapter.connect({url, user, pw}, false)
      console.log(success)
      if(success === false || success === null) return
      // We are online (y)

      // Create path out of model
      const map = await adapter.collectFilesForPushSync(model, false)
      console.log('map', map)

      for(let [key, value] of map) {
        const conflicts = await syncAdapter.isConflicting(value, key.path, this.state.type === 'new')
        console.log('conflicts', conflicts)
        if(conflicts === true) {
          return dispatch(MessageAction.set('The file has changed on remote server. Please sync first.'))
        } else {
          syncAdapter.pushFile(key.path, value, false)
        }
      }
    }

    savePassword(
      model,
      oldModel,
      type,
      () => this.setState({model: {}}, () => this.changeToPreviousLocation())
    )
  }

  changeToPreviousLocation = () => this.props.history.goBack()

  /**
   * Handler when password properties change
   */
  handleStateChange = (key, value) => {
    this.setState({
      model: Object.assign({}, this.state.model, {
        [key]: value
      })
    }, () => console.log(this.state))
  }

  render() {
    const {classes, persistence: {groups}} = this.props

    return (
      <AppBar backButton name={(this.state.type == 'new') ? 'Create password' : 'Edit password'} withGrid>
        <EditPassword model={this.state.model} handleStateChange={this.handleStateChange} groups={groups}/>

        <Button
          variant="fab"
          className={classes.fab}
          color="secondary"
          onClick={() => this.onSave().catch(e => console.warn(e))}
        >
          <Check />
        </Button>
      </AppBar>
    )
  }
}

const mapStateToProps = ({config: {store: config}, persistence, sync: {adapter: syncAdapter}, settings: {readOnly: settingsReadOnly}}) => ({config, persistence, syncAdapter, settingsReadOnly})

export default withRouter(withStyles(styles)(connect(mapStateToProps)(Password)))
