import { theme } from '../../../../theme/theme.native'
import { createStackNavigator } from 'react-navigation'
import Login from '../../Login'

const APP_TITLE = 'Safeword'

/**
 * Shows the login screen
 */
const LoginStack = createStackNavigator({
  Login: { screen: Login }
}, {
  headerMode: 'screen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: theme.palette.primary.main,
      elevation: 0
    },
    title: APP_TITLE,
    headerTintColor: theme.palette.primary.contrastText
  }
})

export default LoginStack
