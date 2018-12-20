import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'

import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'

import SetupOrRestore from './SetupOrRestore'
import Login from './Login'
import RecentPasswords from './RecentPasswords'
import AllPasswords from './AllPasswords'
import Setup from './Setup'
import Restore from './Restore'
import Settings from './Settings'
import About from './About'
import Loading from './Loading'
import Password from './Password'
import ManageGroups from './ManageGroups'
import Group from './Group'
import ImportExport from './ImportExport'
import Sync from './Sync'
import Profile from './Profile'
import License from './License'

const locationHelper = locationHelperBuilder({})

const ifAuthenticated = connectedRouterRedirect({
  redirectPath: (state, ownProps) => (locationHelper.getRedirectQueryParam(ownProps) || '/'),
  allowRedirectBack: false,
  authenticatedSelector: state => state.auth.token !== null, // If false then redirect
  wrapperDisplayName: 'IfAuthentiated'
})

const ifSetup = connectedRouterRedirect({
  redirectPath: (state, ownProps) => (locationHelper.getRedirectQueryParam(ownProps) || '/setup'),
  allowRedirectBack: false,
  authenticatedSelector: state => state.setup.completed === true,
  wrapperDisplayName: 'IfSetup'
})

const Routes = () => (
  <div>
    <Route exact path='/' component={Loading} />
    <Route path='/login' component={ifSetup(Login)} />

    <Route path='/passwords/recent' component={ifAuthenticated(RecentPasswords)} />
    <Route path='/passwords/all' component={ifAuthenticated(AllPasswords)} />
    <Route path='/password/e' component={ifAuthenticated(Password)} />

    <Route path='/group/passwords' component={ifAuthenticated(Group)} />

    <Route exact path='/setup' component={SetupOrRestore} />
    <Route path='/setup/configure' component={Setup} />
    <Route path='/setup/restore' component={Restore} />

    <Route path='/groups' component={ifAuthenticated(ManageGroups)} />

    <Route exact path='/settings' component={ifAuthenticated(Settings)} />
    <Route path='/settings/import-export' component={ifAuthenticated(ImportExport)} />
    <Route path='/settings/sync' component={ifAuthenticated(Sync)} />
    <Route path='/settings/profile' component={ifAuthenticated(Profile)} />
    <Route exact path='/about' component={ifAuthenticated(About)} />
    <Route exact path='/about/license' component={ifAuthenticated(License)} />
  </div>
)

Routes.propTypes = {
  style: PropTypes.object
}

export default Routes
