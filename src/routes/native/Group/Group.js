import React from 'react'

import { theme } from '../../../theme/theme.native'
import { StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import Passwords from '../../../components/native/Passwords'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'
import NavigationService from '../../../service/native'

const styles = StyleSheet.create({
  coloredBackground: {
    backgroundColor: theme.palette.primary.light
  }
})

class Group extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.group.name,
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

  render() {
    return (
      <InfoAwareRouteComponent style={styles.coloredBackground}>
        <Passwords mode="filter" group={this.props.navigation.state.params.group} />
      </InfoAwareRouteComponent>
    )
  }
}

export default Group
