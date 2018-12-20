import React from 'react'

import { StyleSheet } from 'react-native'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'
import Passwords from '../../../components/native/Passwords'
import { theme } from '../../../theme/theme.native'

const styles = StyleSheet.create({
  coloredBackground: {
    backgroundColor: theme.palette.primary.light
  }
})

const AllPasswords = () => (
  <InfoAwareRouteComponent style={styles.coloredBackground}>
    <Passwords mode="all"/>
  </InfoAwareRouteComponent>
)

AllPasswords.navigationOptions = {
  drawerLabel: 'All passwords'
}

export default AllPasswords
