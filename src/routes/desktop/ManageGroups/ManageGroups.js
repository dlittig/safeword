import React from 'react'

import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Button } from '@material-ui/core'
import Add from '@material-ui/icons/Add'

import Navigation from '../../../components/desktop/Navigation'
import Group from '../../../components/desktop/Group'
import EditGroup from '../../../components/desktop/EditGroup'
import GroupModel from '../../../model/Group'
import EmptyState from '../../../components/desktop/EmptyState'
import fs from '../../../modules/filesystem'
import { saveGroup } from '../../../components/core/Group'

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 5,
    right: theme.spacing.unit * 5
  }
})

class ManageGroups extends React.Component {
  state = {
    editGroupOpen: false
  }

  /**
   * Handles group edit close event
   */
  handleClose = prop => event => {
    if(prop !== 'close') {
      const result = saveGroup(new GroupModel(new Date().getTime(), prop), 'name')
      if(result === true) {
        this.setState({editGroupOpen: false})
      }
    } else {
      this.setState({editGroupOpen: false})
    }
  }

  render() {
    const {groups, classes} = this.props

    return (
      <Navigation name="Manage groups">
        <Grid container spacing={24}>
          {groups.map((object, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Group model={object} name={object.name} />
            </Grid>
          ))}

          {(groups.length === 0) && (
            <EmptyState text="No groups saved so far. Create a few with the plus button." />
          )}
        </Grid>

        <EditGroup
          open={this.state.editGroupOpen}
          handleClose={this.handleClose}
          title="New group"
        />

        <Button
          variant="fab"
          className={classes.fab}
          color="secondary"
          onClick={() => this.setState({editGroupOpen: !this.state.editGroupOpen})}
        >
          <Add />
        </Button>
      </Navigation>
    )
  }
}

const mapStateToProps = ({persistence: {groups, adapter}}) => ({groups, adapter})

export default connect(mapStateToProps)(withStyles(styles)(ManageGroups))
