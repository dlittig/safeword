import React from 'react'

import { View, Text, Spinner } from 'native-base'
import { connect } from 'react-redux'
import { Setup as SetupAction } from '../../../store/actions/Setup'
import { theme } from '../../../theme/theme.native'
import { StyleSheet } from 'react-native'
import NavigationService from '../../../service/native/NavigationService'
import fs from '../../../modules/filesystem'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main
  }
})

class Loading extends React.Component {

  componentDidUpdate() {
    const { completed } = this.props
    console.log(completed)
    if(completed === true) {
      NavigationService.navigate('Login')
    } else if(completed === false) {
      NavigationService.navigate('SetupOrRestore')
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    fs.checkFiles().then(result => {
      console.log(result)
      if(result === true) {
        dispatch(SetupAction.complete({}))
      } else {
        dispatch(SetupAction.uncomplete())
      }
    }).catch(error => {
      console.warn(error)
      dispatch(SetupAction.uncomplete())
    })
  }

  render() {
    return (
      <InfoAwareRouteComponent>
        <View style={styles.container}>
          <Spinner color={theme.palette.secondary.main} />
          <Text>Starting Safeword...</Text>
        </View>

      </InfoAwareRouteComponent>
    )
  }
}

const mapStateToProps = ({setup: {completed}}) => ({completed})

export default connect(mapStateToProps)(Loading)
