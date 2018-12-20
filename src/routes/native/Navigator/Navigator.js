import { createSwitchNavigator } from 'react-navigation'

import LoadingStack from './parts/Loading'
import DrawerNavigation from './parts/Drawer'
import LoginStack from './parts/Login'
import SetupOrRestoreStack from './parts/Setup'

/**
 * Manifest of possible screens
 */
const Navigator = createSwitchNavigator({
  loadingStack: { screen: LoadingStack },
  // Drawer not showing for login stack
  loginStack: { screen: LoginStack },
  // Drawer showing
  drawerStack: { screen: DrawerNavigation },
  // Drawer also not showing for setup stack
  setupOrRestoreStack: { screen: SetupOrRestoreStack }
}, {
  // Default config for all screens
  initialRouteName: 'loadingStack'
})

export default Navigator
