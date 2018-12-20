import React from 'react'

import { Icon, Content, View, Fab } from 'native-base'
import { StyleSheet } from 'react-native'
import { theme } from '../../../theme/theme.native'
import NavigationService from '../../../service/native'
import SyncComponent from '../../../components/native/Sync'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.primary.main
  },
  fab: {
    backgroundColor: theme.palette.secondary.main
  }
})

class Sync extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Synchronization',
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
      <View style={styles.container}>
        <SyncComponent />

        <Fab
          position="bottomRight"
          style={styles.fab}
          onPress={() => console.log('sync')}
          active={true}
        >
          <Icon name="sync" />
        </Fab>
      </View>
    )
  }
}

export default Sync
