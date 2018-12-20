import React from 'react'
import PropTypes from 'prop-types'
import { ConfirmDialog as Dialog } from 'react-native-simple-dialogs'
import { theme } from '../../../theme/theme.native'

const ConfirmDialog = ({open, handleCancel, title, message, handleAccept}) => (
  <Dialog
    title={title}
    message={message}
    visible={open}
    onTouchOutside={() => this.setState({dialogVisible: false})}
    positiveButton={{
      title: 'Accept',
      onPress: () => handleAccept(),
      titleStyle: {
        color: theme.palette.secondary.main
      }
    }}
    negativeButton={{
      title: 'Cancel',
      onPress: () => handleCancel(),
      titleStyle: {
        color: theme.palette.secondary.main
      }
    }}
  />
)

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleAccept: PropTypes.func.isRequired
}

export default ConfirmDialog
