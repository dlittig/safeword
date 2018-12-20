import React from 'react'
import { StyleSheet } from 'react-native'
import { Fab, Icon, View, Item, Input, Label, Form } from 'native-base'
import { connect } from 'react-redux'

import { Setup as SetupAction } from '../../../store/actions/Setup'
import Auth from '../../../store/actions/Auth'
import { login, hydrate } from '../../core/LoginForm'
import NavigationService from '../../../service/native/NavigationService'

import { theme } from '../../../theme/theme.native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '70%'
  },
  fab: {
    backgroundColor: theme.palette.secondary.main
  }
})

class LoginForm extends React.Component {
  state = {
    password: ''
  }

  /**
   * Starts the login process, if a password was entered.
   */
  handleLogin = () => {
    const {dispatch, config, settings} = this.props
    this.setState({password: this._password.props.value}, () => {
      if(this.state.password === '') {
        // Display error
        dispatch(SetupAction.error('Please enter a password.'))
        return null
      }

      login(this.state.password, config, settings, NavigationService).then(result => {
        if(result === true) {
          return hydrate()
        } else if(result === false) {
          // Display error
          dispatch(SetupAction.error('Safeword failed to unlock. Please reenter the password.'))
          return null
        }
      })
        .then(result => {
          if(result !== null) {
            dispatch(Auth.login('username', 'password'))
            NavigationService.navigate('drawerStack')
          }
        })
        .catch(error => console.log('catched error', error))
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Form style={styles.form}>
          <Item floatingLabel>
            <Label>Enter masterpassword...</Label>
            <Input
              secureTextEntry
              getRef={input => this._password = input}
              style={styles.label}
            />
          </Item>
        </Form>

        <Fab
          position="bottomRight"
          style={styles.fab}
          onPress={this.handleLogin}
          active={true}
        >
          <Icon name="checkmark" />
        </Fab>
      </View>
    )
  }
}

const mapStateToProps = ({config: {store: config}, settings: {store: settings}}) => ({config, settings})

export default connect(mapStateToProps)(LoginForm)
