import React from 'react'

import { View, Form, Button, Text } from 'native-base'
import { StyleSheet } from 'react-native'
import NavigationService from '../../../service/native/NavigationService'
import { theme } from '../../../theme/theme.native'
import PropTypes from 'prop-types'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '75%'
  },
  button: {
    marginBottom: 15
  }
})

class SetupOrRestore extends React.Component {
  changeLocation = props => event => {
    const {dispatch, navigation} = this.props
    //dispatch(Auth.login('username', 'password'))
    NavigationService.navigate(props)
  }

  render() {
    return(
      <InfoAwareRouteComponent>
        <View style={styles.container}>
          <Form style={styles.form}>
            <Button block light style={styles.button} onPress={this.changeLocation('Restore')}>
              <Text>Restore from backup</Text>
            </Button>

            <Button block light onPress={this.changeLocation('Setup')}>
              <Text>Setup new storage</Text>
            </Button>
          </Form>
        </View>
      </InfoAwareRouteComponent>
    )
  }
}

export default SetupOrRestore
