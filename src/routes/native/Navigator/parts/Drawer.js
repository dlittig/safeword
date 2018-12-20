import React from 'react'
import { Icon } from 'native-base'
import { createStackNavigator, createDrawerNavigator } from 'react-navigation'
import { theme } from '../../../../theme/theme.native'
import Settings from '../../Settings'
import About from '../../About'
import AllPasswords from '../../AllPasswords'
import RecentPasswords from '../../RecentPasswords'
import ManageGroups from '../../ManageGroups'
import DrawerItems from '../../../../components/native/DrawerItems'
import Password from '../../Password'
import Profile from '../../Profile'
import ImportExport from '../../ImportExport'
import Sync from '../../Sync'
import License from '../../License'
import Group from '../../Group'
import NavigationService from '../../../../service/native'

const APP_TITLE = 'Safeword'

/**
 * Contains all screens that can be reached by the drawer
 */
const DrawerStack = createDrawerNavigator({
  recentPasswords: { screen: RecentPasswords },
  allPasswords: { screen: AllPasswords },
  groups: { screen: ManageGroups },
  settings: { screen: Settings },
  about: { screen: About }
}, {
  initialRouteName: 'recentPasswords',
  contentComponent: props => <DrawerItems navigationProps={{...props}} />
})

DrawerStack.navigationOptions = ({navigation}) => ({
  headerStyle: { backgroundColor: theme.palette.primary.main },
  headerLeft: (
    <Icon
      name="menu"
      size={30}
      style={{marginLeft: 20, color: theme.palette.primary.contrastText}}
      onPress={() => navigation.toggleDrawer()}
    />
  ),
  title: APP_TITLE,
  headerTintColor: theme.palette.primary.contrastText,
})

/**
 * Defines all screens, that can be reached
 * from inside the drawer
 */
const DrawerNavigation = createStackNavigator({
  DrawerStack: { screen: DrawerStack },
  PasswordStack: { screen: Password },
  ProfileStack: { screen: Profile },
  SyncStack: { screen: Sync },
  ImportExportStack: { screen: ImportExport },
  LicenseStack: { screen: License },
  GroupStack: { screen: Group },
})

export default DrawerNavigation
