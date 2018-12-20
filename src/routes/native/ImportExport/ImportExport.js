import React from 'react'

import { Icon, List, ListItem, Body, Text, Content } from 'native-base'
import NavigationService from '../../../service/native'
import { theme } from '../../../theme/theme.native'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.primary.main
  },
  listItem: {
    paddingVertical: 25,
    marginHorizontal: 0,
    marginVertical: 0,
    marginLeft: 0,
    paddingLeft: 6,
    width: '100%'
  }
})

class ImportExport extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Import & export',
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
      <Content style={styles.container}>
        <List>
          <ListItem style={styles.listItem} onPress={() => {}}>
            <Body>
              <Text>Import</Text>
              <Text note>Import passwords and groups</Text>
            </Body>
          </ListItem>
          <ListItem style={styles.listItem} onPress={() => {}}>
            <Body>
              <Text>Export</Text>
              <Text note>Export passwords and groups</Text>
            </Body>
          </ListItem>
        </List>
      </Content>
    )
  }
}

export default ImportExport
