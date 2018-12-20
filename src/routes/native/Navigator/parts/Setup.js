import { theme } from '../../../../theme/theme.native'
import { createStackNavigator } from 'react-navigation'
import SetupOrRestore from '../../SetupOrRestore'
import Setup from '../../Setup'
import Restore from '../../Restore'
import FilePicker from '../../FilePicker'

const APP_TITLE = 'Safeword'

/**
 * Contains all screens that are used when setting up
 * the application.
 */
const SetupOrRestoreStack = createStackNavigator({
  SetupOrRestore: { screen: SetupOrRestore },
  Setup: { screen: Setup },
  FilePicker: { screen : FilePicker },
  //SetPassword: { screen : SetPassword },
  Restore: { screen: Restore },
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

export default SetupOrRestoreStack
