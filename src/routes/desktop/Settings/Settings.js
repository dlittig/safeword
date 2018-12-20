import React from 'react'

import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, List, Switch } from '@material-ui/core'
import { KeyboardArrowRight } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { guessTypeFromString } from '../../../utils'
import PropTypes from 'prop-types'
import Navigation from '../../../components/desktop/Navigation'
import SettingsParameters from '../../../settings/params'

const style = theme => ({
  list: {
    padding: 0
  },
  listItem: {
    paddingLeft: 0,
    borderBottom: '1px solid lightgrey',
    '&:last-of-type': {
      border: 'none !important'
    }
  }
})

class Settings extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { settingsReadOnly } = this.props
    const notificationsEnabled = settingsReadOnly.get(SettingsParameters.NOTIFICATIONS_ENABLED) || true
    const loggingEnabled = settingsReadOnly.get(SettingsParameters.LOGGING_ENABLED) || true
    this.setState({
      notificationsEnabled: guessTypeFromString(notificationsEnabled),
      loggingEnabled: guessTypeFromString(loggingEnabled)
    })
  }

  /**
   * Handles the event when the notification toggle is being used
   */
  onChangeNotificationSettings = () => {
    const { settings } = this.props
    this.setState({notificationsEnabled: !this.state.notificationsEnabled}, async () => {
      await settings.set(SettingsParameters.NOTIFICATIONS_ENABLED, this.state.notificationsEnabled.toString())
      settings.initReadOnly()
    })
  }

  /**
   * Handles the event when the logging toggle is being used
   */
  onChangeLoggingSettings = () => {
    const { settings } = this.props
    this.setState({loggingEnabled: !this.state.loggingEnabled}, async () => {
      await settings.set(SettingsParameters.LOGGING_ENABLED, this.state.loggingEnabled.toString())
      settings.initReadOnly()
    })
  }

  state = {
    notificationsEnabled: true,
    loggingEnabled: true
  }

  changeLocation = path => this.props.history.push(path)

  render() {
    const { classes, settingsReadOnly } = this.props
    console.dir(settingsReadOnly)

    return (
      <Navigation name="Settings">
        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="Profile"
              secondary="Enter profile to improve password strength"
            />
            <ListItemSecondaryAction>
              <IconButton aria-label="Change" onClick={() => this.changeLocation('/settings/profile')}>
                <KeyboardArrowRight />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="Import and export"
              secondary="Import or export data to use it with an other manager or as a backup"
            />
            <ListItemSecondaryAction>
              <IconButton aria-label="Change" onClick={() => this.changeLocation('/settings/import-export')}>
                <KeyboardArrowRight />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="Synchronization"
              secondary="Synchronize the data with a cloud service"
            />
            <ListItemSecondaryAction>
              <IconButton aria-label="Change" onClick={() => this.changeLocation('/settings/sync')}>
                <KeyboardArrowRight />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="Notifications"
              secondary="Configure notifications"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={this.state.notificationsEnabled}
                onChange={this.onChangeNotificationSettings}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem className={classes.listItem}>
            <ListItemText
              primary="Logging"
              secondary="Log authentication attempts to a text file"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={this.state.loggingEnabled}
                onChange={this.onChangeLoggingSettings}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Navigation>
    )
  }
}

const mapStateToProps = ({settings: {store: settings, readOnly: settingsReadOnly}}) => ({settings, settingsReadOnly})

export default connect(mapStateToProps)(withRouter(withStyles(style)(Settings)))
