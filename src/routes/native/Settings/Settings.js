import React from 'react'

import { connect } from 'react-redux'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Content, Icon, List, ListItem, Body, Right, Switch } from 'native-base'
import { theme } from '../../../theme/theme.native'
import { guessTypeFromString } from '../../../utils'
import SettingsParameters from '../../../settings/params'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'
import NavigationService from '../../../service/native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.primary.main
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

class Settings extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Settings',
    drawerIcon: ({ tintColor }) => (
      <Icon
        name="settings"
        size={20}
      />
    ),
    title: 'Settings'
  }

  state = {
    notificationsEnabled: true,
    loggingEnabled: true
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

  render() {
    return (
      <InfoAwareRouteComponent style={styles.container}>
        <Content>
          <List>
            <ListItem style={styles.listItem} onPress={() => NavigationService.navigate('ProfileStack')}>
              <Body>
                <Text>Profile</Text>
                <Text note>Enter profile to improve password strength</Text>
              </Body>
              <Right>
                <Icon type="MaterialIcons" name="chevron-right" />
              </Right>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => NavigationService.navigate('ImportExportStack')}>
              <Body>
                <Text>Import and export</Text>
                <Text note>Import or export data to use it with an other manager or as a backup</Text>
              </Body>
              <Right>
                <Icon type="MaterialIcons" name="chevron-right" />
              </Right>
            </ListItem>
            <ListItem style={styles.listItem} onPress={() => NavigationService.navigate('SyncStack')}>
              <Body>
                <Text>Synchronization</Text>
                <Text note>Synchronize the data with a cloud service</Text>
              </Body>
              <Right>
                <Icon type="MaterialIcons" name="chevron-right" />
              </Right>
            </ListItem>
            <ListItem style={styles.listItem}>
              <Body>
                <Text>Notifications</Text>
                <Text note>Configure notifications</Text>
              </Body>
              <Right>
                <Switch
                  value={this.state.notificationsEnabled}
                  onValueChange={this.onChangeNotificationSettings}
                />
              </Right>
            </ListItem>
            <ListItem style={styles.listItem}>
              <Body>
                <Text>Logging</Text>
                <Text note>Log authentication attempts to a text file</Text>
              </Body>
              <Right>
                <Switch
                  value={this.state.loggingEnabled}
                  onValueChange={this.onChangeLoggingSettings}
                />
              </Right>
            </ListItem>
          </List>
        </Content>
      </InfoAwareRouteComponent>
    )
  }
}

const mapStateToProps = ({settings: {readOnly: settingsReadOnly}, settings: {store: settings}}) => ({settingsReadOnly, settings})

export default connect(mapStateToProps)(Settings)
