import React from 'react'

import PropTypes from 'prop-types'
import { StyleSheet, Modal } from 'react-native'
import { View, Text, Button, Form, Item, Label, Input } from 'native-base'
import { ConfirmDialog } from 'react-native-simple-dialogs'
import { isObjectEmpty } from '../../../utils'
import { theme } from '../../../theme/theme.native'

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10
  }
})

class InputDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }

  state = {
    value: ''
  }

  componentDidMount() {
    const {value} = this.props
    this.setState({value})
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.open === false) {
      this.setState({value: ''})
    } else {
      this.setState({value: nextProps.value})
    }
  }

  render() {
    const {open, handleClose, title, content, label} = this.props

    return (
      <ConfirmDialog
        title={title}
        visible={open}
        onTouchOutside={() => handleClose('close')}
        positiveButton={{
          title: 'Save',
          onPress: () => handleClose(this.state.value),
          titleStyle: {
            color: theme.palette.secondary.main
          }
        }}
        negativeButton={{
          title: 'Cancel',
          onPress: () => handleClose('close'),
          titleStyle: {
            color: theme.palette.secondary.main
          }
        }}
      >
        <Text>{content}</Text>

        <Form>
          <Item floatingLabel>
            <Label>{label}</Label>
            <Input
              value={this.state.value}
              onChangeText={value => this.setState({value})}
            />
          </Item>
        </Form>
      </ConfirmDialog>
    )
  }
}

export default InputDialog
