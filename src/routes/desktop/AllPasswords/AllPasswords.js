import React from 'react'

import Navigation from '../../../components/desktop/Navigation'
import Passwords from '../../../components/desktop/Passwords'

const AllPasswords = () => (
  <Navigation name="All passwords">
    <Passwords mode="all" />
  </Navigation>
)

export default AllPasswords
