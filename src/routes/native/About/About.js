import React from 'react'

import { StyleSheet } from 'react-native'
import { Text, Content, List, ListItem, Body, Right, Icon } from 'native-base'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'
import { theme } from '../../../theme/theme.native'
import NavigationService from '../../../service/native'

const styles = StyleSheet.create({
  container: {
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

const About = props => (
  <InfoAwareRouteComponent style={styles.container}>
    <Content>
      <List>
        <ListItem style={styles.listItem}>
          <Body>
            <Text>Developer</Text>
            <Text note>David Littig, 2018</Text>
          </Body>
        </ListItem>
        <ListItem style={styles.listItem} onPress={() => NavigationService.navigate('LicenseStack')}>
          <Body>
            <Text>License</Text>
            <Text note>Show license under which Safeword was released</Text>
          </Body>
          <Right>
            <Icon type="MaterialIcons" name="chevron-right" />
          </Right>
        </ListItem>
      </List>
    </Content>
  </InfoAwareRouteComponent>
)

About.navigationOptions = {
  drawerLabel: 'About',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="information-circle"
      size={20}
    />
  ),
}

export default About
