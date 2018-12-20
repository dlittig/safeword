import React from 'react'

import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { View, List, ListItem, Body, Text, Right, Switch, CheckBox, Icon } from 'native-base'
import InputDialog from '../../InputDialog/'
import { theme } from '../../../../theme/theme.native'
import SettingsParameters from '../../../../settings/params'
import { WebdavAdapter } from '../../../../adapters/sync'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  checkbox: {
    marginRight: 12
  },
  listItem: {
    paddingVertical: 25,
    marginHorizontal: 0,
    marginVertical: 0,
    marginLeft: 0,
    paddingLeft: 6,
    width: '100%'
  }
})

class Webdav extends React.Component {
  state = {
    on: false,
    https: false,
    username: '', // demo
    password: '', // demo
    remoteUrl: '', // demo
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
        settings.set(SettingsParameters.WEBDAV_URL, prop.toString())
        break
      case 'username':
        settings.set(SettingsParameters.WEBDAV_USERNAME, prop.toString())
        break
      case 'password':
        settings.set(SettingsParameters.WEBDAV_PASSWORD, prop.toString())
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

  render() {
    return (
      <View style={styles.container}>
        <List>
          <ListItem style={styles.listItem}>
            <Body>
              <Text>WebDAV</Text>
            </Body>
            <Right>
              <Switch
                value={this.state.on}
                onValueChange={this.toggle}
              />
            </Right>
          </ListItem>
        </List>
        { this.state.on === true && (
          <List>
            <ListItem style={styles.listItem}>
              <Body>
                <Text>HTTPS</Text>
                <Text note>{this.state.https ? 'Cloud service uses HTTPS' : 'Cloud service does not use HTTPS'}</Text>
              </Body>
              <Right>
                <CheckBox
                  style={styles.checkbox}
                  color="#c9c8cd"
                  checked={this.state.https}
                  onPress={() => this.setState({https: !this.state.https})}
                />
              </Right>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => this.setState({urlOpen: !this.state.urlOpen})}>
              <Body>
                <Text>Remote url</Text>
                <Text note>Address of the WebDAV server</Text>
              </Body>
              <Right>
                <Icon type="MaterialIcons" name="chevron-right" />
              </Right>
              <InputDialog
                open={this.state.urlOpen}
                value={this.state.remoteUrl}
                handleClose={this.handleClose('remoteUrl')}
                title="Set WebDAV remote url"
                content="Enter the remote url Safeword is using to connect to WebDAV server."
                label="Remote URL"
              />
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => this.setState({usernameOpen: !this.state.usernameOpen})}>
              <Body>
                <Text>Username</Text>
                <Text note>{this.state.username === '' ? 'Username is not set' : 'Username is set'}</Text>
              </Body>
              <Right>
                <Icon type="MaterialIcons" name="chevron-right" />
              </Right>
              <InputDialog
                open={this.state.usernameOpen}
                value={this.state.username}
                handleClose={this.handleClose('username')}
                title="Set WebDAV username"
                content="Enter the username Safeword is using to authenticate at the WebDAV server."
                label="Username"
              />
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => this.setState({passwordOpen: !this.state.passwordOpen})}>
              <Body>
                <Text>Password</Text>
                <Text note>{this.state.password === '' ? 'Password is not set' : 'Password is set'}</Text>
              </Body>
              <Right>
                <Icon type="MaterialIcons" name="chevron-right" />
              </Right>
              <InputDialog
                open={this.state.passwordOpen}
                value={this.state.password}
                handleClose={this.handleClose('password')}
                title="Set WebDAV password"
                content="Enter the password Safeword is using to authenticate at the WebDAV server."
                label="Password"
              />
            </ListItem>
          </List>
        )}
      </View>
    )
  }

}

const mapStateToProps = ({settings: {store: settings}}) => ({settings})

export default connect(mapStateToProps)(Webdav)
