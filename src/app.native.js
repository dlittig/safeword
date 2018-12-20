/**
 * React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from './store/store.native'
import NavigationService from './service/native/NavigationService'
import Navigator from './routes/native/Navigator/Navigator'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigator
          ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}
        />
      </Provider>
    )
  }
}
