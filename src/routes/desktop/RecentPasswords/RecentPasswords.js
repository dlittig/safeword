import React from 'react'

import Navigation from '../../../components/desktop/Navigation'
import Passwords from '../../../components/desktop/Passwords'

const RecentPasswords = () => (
  <Navigation name="Recently used">
    <Passwords mode="recent" />
  </Navigation>
)

export default RecentPasswords
