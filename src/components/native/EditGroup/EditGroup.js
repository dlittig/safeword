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

class EditGroup extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
  }

  state = {
    name: ''
  }

  componentDidUpdate(prevProps) {
    if(this.props.open === false && this.props.open !== prevProps.open) {
      this.setState({name: ''})
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {name} = newProps
    if(name !== undefined && name !== null) {
      this.setState({name})
    }
  }

  render() {
    const { open, handleClose, title } = this.props

    return (
      <ConfirmDialog
        title={title}
        visible={open}
        onTouchOutside={handleClose('close')}
        positiveButton={{
          title: 'Save',
          onPress: handleClose(this.state.name),
          titleStyle: {
            color: theme.palette.secondary.main
          }
        }}
        negativeButton={{
          title: 'Cancel',
          onPress: handleClose('close'),
          titleStyle: {
            color: theme.palette.secondary.main
          }
        }}
      >
        <Text>Enter the name of the group in the text field below. Submit the name by clicking on "Save".</Text>

        <Form>
          <Item floatingLabel>
            <Label>Group name</Label>
            <Input
              value={this.state.name}
              onChangeText={text => this.setState({name: text})}
            />
          </Item>
        </Form>
      </ConfirmDialog>
    )
  }
}

export default EditGroup
