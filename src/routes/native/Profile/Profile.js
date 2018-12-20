import React from 'react'

import { Icon, View, Fab } from 'native-base'
import { theme } from '../../../theme/theme.native'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import NavigationService from '../../../service/native'
import ProfileComponent from '../../../components/native/Profile'
import Settings from '../../../settings'
import SettingsParameters from '../../../settings/params'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.primary.main
  },
  fab: {
    backgroundColor: theme.palette.secondary.main
  }
})

class Profile extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Profile',
    headerStyle: { backgroundColor: theme.palette.primary.main },
    headerTintColor: theme.palette.primary.contrastText,
    headerLeft: (
      <Icon
        name="arrow-back"
        size={30}
        style={{marginLeft: 20, color: theme.palette.primary.contrastText}}
        onPress={() => NavigationService.back()}
      />
    )
  })

  state = {
    firstname: '',
    lastname: '',
    birthday: ''
  }

  UNSAFE_componentWillMount() {
    const {settingsReadOnly} = this.props
    const firstname = settingsReadOnly.get(SettingsParameters.PROFILE_FIRSTNAME)
    const lastname = settingsReadOnly.get(SettingsParameters.PROFILE_LASTNAME)
    const birthday = settingsReadOnly.get(SettingsParameters.PROFILE_BIRTHDAY)
    this.setState({
      firstname,
      lastname,
      birthday
    })
  }

  handleChange = (key, value) => this.setState({[key]: value})

  changeToPreviousLocation = () => NavigationService.back()

  /**
   * Checks if profile has valid properties
   * @returns True if valid, false otherwise
   */
  validate = () => this.state.firstname !== '' && this.state.lastname !== '' && this.state.birthday !== ''

  /**
   * Saves profile properties to settings in redux store if they are valid
   */
  flush = async () => {
    if(this.validate()) {
      const {settings} = this.props
      await settings.set(SettingsParameters.PROFILE_FIRSTNAME, this.state.firstname)
      await settings.set(SettingsParameters.PROFILE_LASTNAME, this.state.lastname)
      await settings.set(SettingsParameters.PROFILE_BIRTHDAY, this.state.birthday)
      settings.initReadOnly()
      this.changeToPreviousLocation()
    }
  }

  render() {
    const {firstname, lastname, birthday} = this.state
    return (
      <View style={styles.container}>
        <ProfileComponent firstname={firstname} lastname={lastname} birthday={birthday} handleChange={this.handleChange} />

        <Fab
          position="bottomRight"
          style={styles.fab}
          onPress={this.flush}
          active={true}
        >
          <Icon name="checkmark" />
        </Fab>
      </View>
    )
  }
}

const mapStateToProps = ({settings: {store: settings}, settings: {readOnly: settingsReadOnly}}) => ({settings, settingsReadOnly})

export default connect(mapStateToProps)(Profile)
