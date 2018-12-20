import React from 'react'

import { StyleSheet } from 'react-native'
import { theme } from '../../../theme/theme.native'
import { Icon } from 'native-base'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'
import Passwords from '../../../components/native/Passwords'

const styles = StyleSheet.create({
  coloredBackground: {
    backgroundColor: theme.palette.primary.light
  }
})

const RecentPasswords = () => (
  <InfoAwareRouteComponent style={styles.coloredBackground}>
    <Passwords mode="recent"/>
  </InfoAwareRouteComponent>
)

RecentPasswords.navigationOptions = {
  drawerLabel: 'Recently used',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="ios-clock"
      size={20}
    />
  ),
}

export default RecentPasswords
