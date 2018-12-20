import React from 'react'

import { Grid, List, ListItem, ListItemText, ListItemSecondaryAction, Switch, Checkbox, IconButton } from '@material-ui/core'
import { KeyboardArrowRight } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import InputDialog from '../../InputDialog'
import SettingsParameters from '../../../../settings/params'
import classNames from 'classnames'
import { WebdavAdapter } from '../../../../adapters/sync'
import { RxAdapter, OpenpgpAdapter } from '../../../../adapters/persistence'

const style = () => ({
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

class Webdav extends React.Component {
  state = {
    on: false,
    https: false,
    username: '',
    password: '',
    remoteUrl: '',
    urlOpen: false,
    usernameOpen: false,
    passwordOpen: false
  }

  /**
   * Handles close when popup asking for text is being closed.
   */
  handleClose = prop => value => {
    if(value !== 'close') {
      this.setState({[prop]: value})
      // TODO Save data to settings
      const {settings} = this.props

      switch(prop) {
      case 'remoteUrl':
        settings.set(SettingsParameters.WEBDAV_URL, value)
        break
      case 'username':
        settings.set(SettingsParameters.WEBDAV_USERNAME, value)
        break
      case 'password':
        settings.set(SettingsParameters.WEBDAV_PASSWORD, value)
        break
      }

      settings.initReadOnly()
    }
    this.setState({urlOpen: false, usernameOpen: false, passwordOpen: false})
  }

  /**
   * Handle the on/off switch for the corresponding adapter.
   */
  toggle = () => {
    const {settings} = this.props

    this.setState({on: !this.state.on}, () => {
      if(this.state.on === true) {
        settings.set(SettingsParameters.SYNC_ADAPTER, WebdavAdapter.description)
      } else {
        settings.set(SettingsParameters.SYNC_ADAPTER, '')
      }
      settings.initReadOnly()
    })
  }

  UNSAFE_componentWillMount() {
    const {settingsReadOnly} = this.props
    const enabled = settingsReadOnly.get(SettingsParameters.SYNC_ADAPTER) === WebdavAdapter.description
    const url = settingsReadOnly.get(SettingsParameters.WEBDAV_URL) || ''
    const user = settingsReadOnly.get(SettingsParameters.WEBDAV_USERNAME) || ''
    const password = settingsReadOnly.get(SettingsParameters.WEBDAV_PASSWORD) || ''

    this.setState({
      on: enabled,
      remoteUrl: url,
      username: user,
      password
    })
  }

  render() {
    const { classes, adapter } = this.props
    console.log(adapter)

    return (
      <Grid>
        <List className={classes.list} dense>
          <ListItem className={classNames([classes.listHeader, classes.listItem])}>
            <ListItemText
              secondary="WebDAV"
            />
            <ListItemSecondaryAction>
              <Switch
                /*disabled={adapter.describe() === RxAdapter.description}*/
                checked={this.state.on}
                onChange={this.toggle}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        { this.state.on === true && (
          <List>
            <ListItem className={classes.listItem}>
              <ListItemText
                primary="HTTPS"
                secondary={this.state.https ? 'Cloud service uses HTTPS' : 'Cloud service does not use HTTPS'}
              />
              <ListItemSecondaryAction>
                <Checkbox
                  checked={this.state.https}
                  onChange={() => this.setState({https: !this.state.https})}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText
                primary="Remote url"
                secondary="Address of the WebDAV server"
              />
              <ListItemSecondaryAction>
                <IconButton aria-label="Change" onClick={() => this.setState({urlOpen: !this.state.urlOpen})}>
                  <KeyboardArrowRight />
                </IconButton>
              </ListItemSecondaryAction>
              <InputDialog
                open={this.state.urlOpen}
                value={this.state.remoteUrl}
                handleClose={this.handleClose('remoteUrl')}
                title="Set WebDAV remote url"
                content="Enter the remote url Safeword is using to connect to WebDAV server."
                label="Remote URL"
              />
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText
                primary="Username"
                secondary={this.state.username === '' ? 'Username is not set' : 'Username is set'}
              />
              <ListItemSecondaryAction>
                <IconButton aria-label="Change" onClick={() => this.setState({usernameOpen: !this.state.usernameOpen})}>
                  <KeyboardArrowRight />
                </IconButton>
              </ListItemSecondaryAction>
              <InputDialog
                open={this.state.usernameOpen}
                value={this.state.username}
                handleClose={this.handleClose('username')}
                title="Set WebDAV username"
                content="Enter the username Safeword is using to authenticate with WebDAV."
                label="Username"
              />
            </ListItem>
            <ListItem className={classes.listItem}>
              <ListItemText
                primary="Password"
                secondary={this.state.password === '' ? 'Password is not set' : 'Password is set'}
              />
              <ListItemSecondaryAction>
                <IconButton aria-label="Change" onClick={() => this.setState({passwordOpen: !this.state.passwordOpen})}>
                  <KeyboardArrowRight />
                </IconButton>
              </ListItemSecondaryAction>
              <InputDialog
                open={this.state.passwordOpen}
                value={this.state.password}
                handleClose={this.handleClose('password')}
                title="Set WebDAV password"
                content="Enter the password Safeword is using to authenticate with WebDAV."
                label="Password"
              />
            </ListItem>
          </List>
        )}
      </Grid>
    )
  }
}

const mapStateToProps = ({settings: {store: settings}, settings: {readOnly: settingsReadOnly}, persistence: {adapter}}) => ({adapter, settings, settingsReadOnly})

export default connect(mapStateToProps)(withStyles(style)(Webdav))
