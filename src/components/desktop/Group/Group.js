import React from 'react'

import { connect } from 'react-redux'
import { Avatar, Card, CardHeader, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Create, Delete } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import ConfirmDialog from '../ConfirmDialog'
import EditGroup from '../EditGroup'
import PropTypes from 'prop-types'
import { updateGroup } from '../../core/Group'

const styles = theme => ({
  avatar: {
    backgroundColor: theme.palette.primary.dark,
    color: 'black'
  }
})

const ITEM_HEIGHT = 48

class Group extends React.Component {
  state = {
    confirmOpen: false,
    editGroupOpen: false,
    name: ''
  }

  static propTypes = {
    model: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired
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
   * Finally deletes the group because the user confirmed that process
   */
  onConfirmDelete = () => {
    const {adapter, model} = this.props
    adapter.deleteGroup(model)
    this.setState({confirmOpen: false})
  }

  /**
   * Close popup
   */
  handleCancel = () => this.setState({confirmOpen: false})

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
    const {classes, model} = this.props

    return (
      <div>
        <ConfirmDialog
          title="Delete"
          message="Do you really want to delete the group?"
          handleCancel={this.handleCancel}
          handleAccept={this.onConfirmDelete}
          open={this.state.confirmOpen}
        />

        <EditGroup
          open={this.state.editGroupOpen}
          name={this.state.name}
          handleClose={this.handleClose}
          title="Edit group"
        />

        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                {this.state.name.charAt(0).toUpperCase()}
              </Avatar>
            }
            action={
              <div>
                <IconButton
                  aria-label="Edit"
                  onClick={this.onEdit}
                >
                  <Create />
                </IconButton>
                <IconButton
                  aria-label="Delete"
                  onClick={this.onDelete}
                >
                  <Delete />
                </IconButton>
              </div>
            }
            title={this.state.name}
            subheader={`${model.passwords.length} password(s)`}
          />
        </Card>
      </div>
    )
  }
}

const mapStateToProps = ({persistence: {adapter}}) => ({adapter})

export default connect(mapStateToProps)(withStyles(styles)(Group))
