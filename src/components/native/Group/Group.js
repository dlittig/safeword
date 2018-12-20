import React from 'react'

import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Card, CardItem, Left, Button, Text, Body, Right, Icon, View } from 'native-base'
import { theme } from '../../../theme/theme.native'
import ConfirmDialog from '../ConfirmDialog'
import EditGroup from '../EditGroup'
import { updateGroup } from '../../core/Group'

const styles = StyleSheet.create({
  avatar: {
    fontSize: 18,
    paddingLeft: 0,
    paddingRight: 0,
    color: 'black'
  },
  button: {
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.dark
  },
  dropdown: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    elevation: 0,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    flex: 1,
    alignSelf: 'stretch',
    color: '#aaa'
  },
  cardItem: {
    marginRight: 16,
    marginLeft: -16
  },
  row: {
    flexDirection: 'row'
  },
  icon: {
    width: 30,
    color: '#333'
  }
})

class Group extends React.Component {
  state = {
    confirmOpen: false,
    editGroupOpen: false,
    name: ''
  }

  /**
   * Opens popup to edit the group
   */
  onEdit = () => this.setState({editGroupOpen: true})

  /**
   * Opens confirmation window to delete group
   */
  onDelete = () => this.setState({confirmOpen: true})

  /**
   * Close popup
   */
  handleCancel = () => this.setState({confirmOpen: false})

  /**
   * Finally deletes the group because the user confirmed that process
   */
  onConfirmDelete = () => {
    const {adapter, model} = this.props
    adapter.deleteGroup(model)
  }

  /**
   * Handles close event of the update popup. If the name has changed, the entity is being updated.
   */
  handleClose = prop => event => {
    if(prop !== 'close') {
      const { model } = this.props
      const result = updateGroup(model, prop)
      if(result === true) {
        this.setState({editGroupOpen: false, name: prop})
      }
    } else {
      this.setState({editGroupOpen: false})
    }
  }

  UNSAFE_componentWillMount() {
    const {name} = this.props.model
    this.setState({name})
  }

  render() {
    const { model } = this.props

    return (
      <Card style={styles.card}>
        <ConfirmDialog
          title="Delete"
          message="Do you really want to delete the group?"
          handleCancel={this.handleCancel}
          handleAccept={this.onConfirmDelete}
          open={this.state.confirmOpen}
        />
        <EditGroup
          open={this.state.editGroupOpen}
          handleClose={this.handleClose}
          name={this.state.name}
          title="Edit group"
        />
        <CardItem>
          <Left>
            <Button rounded style={styles.button}>
              <Text style={styles.avatar}>&nbsp;{this.state.name.charAt(0)}&nbsp;</Text>
            </Button>
            <Body>
              <Text>{this.state.name}</Text>
              <Text numberOfLines={1} style={styles.subtitle}>{`${model.passwords.length} password(s)`}</Text>
            </Body>
          </Left>
          <Right>
            <View style={styles.row}>
              <Button onPress={this.onEdit} style={styles.dropdown}>
                <Icon name="create" style={styles.icon} />
              </Button>
              <Button onPress={this.onDelete} style={styles.dropdown}>
                <Icon type="MaterialIcons" name="delete" style={styles.icon} />
              </Button>
            </View>
          </Right>
        </CardItem>
      </Card>
    )
  }
}

const mapStateToProps = ({persistence: {adapter}}) => ({adapter})

export default connect(mapStateToProps)(Group)
