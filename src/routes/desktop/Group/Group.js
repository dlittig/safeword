import React from 'react'

import Navigation from '../../../components/desktop/Navigation'
import Passwords from '../../../components/desktop/Passwords'
import { withRouter } from 'react-router-dom'

const Group = props => (
  <Navigation name={props.location.state.group.name}>
    <Passwords mode="filter" group={props.location.state.group} />
  </Navigation>
)

export default withRouter(Group)
