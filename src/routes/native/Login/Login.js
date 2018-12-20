import React from 'react'

import LoginForm from '../../../components/native/LoginForm'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'

const Login = (props) => (
  <InfoAwareRouteComponent>
    <LoginForm navigation={props.navigation} />
  </InfoAwareRouteComponent>
)

export default Login
