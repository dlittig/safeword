import { NavigationActions } from 'react-navigation'

let _navigator

/**
 * Sets navigator for this service
 * @param {Object} navigatorRef Navigation entity
 */
function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

/**
 * Navigates to the specified screen
 * @param {String} routeName The screen to navigate to
 * @param {Object} params Additional parameters that are being pushed to the route
 */
function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  )
}

/**
 * Navigates back in the stack
 * @param {*} option Navigation options
 */
function back(option) {
  _navigator.dispatch(
    NavigationActions.back({key: option})
  )
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  back
}
