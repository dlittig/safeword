import React from 'react'

import { connect } from 'react-redux'
import { Toast, Container, Root } from 'native-base'
import { StatusBar } from 'react-native'
import { Setup as SetupAction } from '../../../store/actions/Setup'
import { Message as MessageAction } from '../../../store/actions/Message'
import { theme } from '../../../theme/theme.native'

class InfoAwareRouteComponent extends React.Component {
  componentDidUpdate(prevProps) {
    const {dispatch} = this.props
    const {message, type} = this.getChannel(prevProps)
    if(message !== undefined && type !== undefined) {
      Toast.show({
        text: message,
        duration: 4000,
        onClose: () => {
          this.setState({open: false})
          dispatch((type === 'info') ? MessageAction.clear() : SetupAction.clearError())
        }
      })
    }
  }

  /**
   * Checks for messages to display
   * @returns Object with the message and its type
   */
  getChannel = prevProps => {
    const {setup : {error: prevError}, message: {info: prevInfo}} = prevProps
    const {setup: {error}} = this.props
    const {message: {info}} = this.props

    if(error !== null && prevError !== error) {
      return {message: error, type: 'error'}
    } else if(info !== null && prevInfo !== info) {
      return {message: info, type: 'info'}
    } else return {}
  }

  render() {
    return (
      <Root>
        <Container {...this.props}>
          <StatusBar
            animated={true}
            barStyle="dark-content"
            backgroundColor={theme.palette.primary.dark}
          />
          {this.props.children}
        </Container>
      </Root>
    )
  }
}

const mapStateToProps = ({setup, message}) => ({setup, message})
export default connect(mapStateToProps)(InfoAwareRouteComponent)
