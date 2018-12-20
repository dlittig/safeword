import React from 'react'

import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { View, Form, Fab, Icon, Item, Label, Input, Text } from 'native-base'
import { Setup as SetupAction } from '../../../../store/actions/Setup'
import { handleComplete, validatePassword } from '../../../core/Setup'
import { theme } from '../../../../theme/theme.native'
import NavigationService from '../../../../service/native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main
  },
  fab: {
    backgroundColor: theme.palette.secondary.main
  },
  borderless: {
    borderBottomWidth: 0,
    borderColor: 'transparent',
  },
  helpText: {
    color: '#a9a5ac'
  },
  errorText: {
    color: '#e00'
  },
  successText: {
    color: '#090'
  }
})

class SetPassword extends React.Component {
  state = {
    password: '',
    passwordRepitition: '',
    passwordHasError: false
  }

  static propTypes = {
    password: PropTypes.string.isRequired,
    passwordRepitition: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired
  }

  componentDidMount() {
    const {password, passwordRepitition} = this.props
    this.setState({
      password,
      passwordRepitition
    })
  }

  /**
   * Checks if the repitition matches the first password
   * @returns True if both passwords are equal, otherwise false
   */
  validateRepitition = () => this.state.password === this.state.passwordRepitition

  /**
   * Change passwords in this component and in the parent component
   */
  handleChange = props => {
    const {type, value} = props
    this.setState({ [type]: value }, () => {
      this.props.handleChange(type, value)
      //const { dispatch, completed, setup } = this.props

      // Show error if password is not valid and password is longer than 0
      this.setState({passwordHasError: !validatePassword(this.state.password) && this.state.password.length > 0})
    })
  }

  render() {
    const inputAttributes = { error: this.state.passwordHasError, success: this.validateRepitition() && this.state.passwordHasError === false && this.state.password !== '' }
    const repititionAttributes = { success: this.validateRepitition() && this.state.passwordHasError === false && this.state.password !== '' }

    return (
      <View style={styles.container}>
        <Form>
          <Item floatingLabel {...inputAttributes}>
            <Label style={[(inputAttributes.error) ? styles.errorText : null, (inputAttributes.success) ? styles.successText : null]}>Enter masterpassword</Label>
            <Input
              secureTextEntry
              onChangeText={text => this.handleChange({type: 'password', value: text})}
              style={styles.label}
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </Item>

          <Item style={styles.borderless}>
            <Text style={[styles.helpText, (this.state.passwordHasError) ? styles.errorText : null]}>Password should have at least 16 characters, contain lowercase, uppercase letters, numbers and special characters</Text>
          </Item>

          <Item floatingLabel {...repititionAttributes}>
            <Label style={(inputAttributes.success) ? styles.successText : null}>Repeat masterpassword</Label>
            <Input
              secureTextEntry
              onChangeText={text => this.handleChange({type: 'passwordRepitition', value: text})}
              style={styles.label}
            />
          </Item>
        </Form>
      </View>
    )
  }
}

const mapStateToProps = ({setup, config: {store: configuration}}) => ({setup, configuration})

export default connect(mapStateToProps)(SetPassword)
