import React from 'react'

import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Button } from '@material-ui/core'
import AppBar from '../../../components/desktop/AppBar'
import ProfileComponent from '../../../components/desktop/Profile'
import Check from '@material-ui/icons/Check'
import Settings from '../../../settings'
import SettingsParameters from '../../../settings/params'

const style = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 5,
    right: theme.spacing.unit * 5
  }
})

class Profile extends React.Component {
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

  changeToPreviousLocation = () => this.props.history.goBack()

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
    const {classes} = this.props

    return (
      <AppBar withGrid backButton name="Profile">
        <ProfileComponent firstname={this.state.firstname} lastname={this.state.lastname} birthday={this.state.birthday} handleChange={this.handleChange} />

        <Button
          variant="fab"
          className={classes.fab}
          color="secondary"
          onClick={this.flush}
        >
          <Check />
        </Button>
      </AppBar>
    )
  }
}

const mapStateToProps = ({settings: {store: settings, readOnly: settingsReadOnly}}) => ({settings, settingsReadOnly})

export default connect(mapStateToProps)(withStyles(style)(Profile))
