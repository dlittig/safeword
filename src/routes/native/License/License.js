import React from 'react'

import { Icon, Text, Content } from 'native-base'
import { StyleSheet } from 'react-native'
import { theme } from '../../../theme/theme.native'
import globals from '../../../globals'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'
import NavigationService from '../../../service/native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.palette.primary.main
  },
  code: {
    fontFamily: 'Monospace',
    marginBottom: 32
  },
  padding: {
    padding: 16
  }
})

const License = () => (
  <InfoAwareRouteComponent style={styles.container}>
    <Content style={styles.padding}>
      <Text style={styles.code}>{globals.GPL}</Text>
    </Content>
  </InfoAwareRouteComponent>
)

License.navigationOptions = ({navigation}) => ({
  title: 'License',
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

export default License
