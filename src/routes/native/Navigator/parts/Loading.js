import { theme } from '../../../../theme/theme.native'
import { createStackNavigator } from 'react-navigation'
import Loading from '../../Loading'

const APP_TITLE = 'Safeword'

/**
 * Specifies the loading screen which
 * is being displayed at the start of
 * the application
 */
const LoadingStack = createStackNavigator({
  Loading: { screen: Loading }
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

export default LoadingStack
