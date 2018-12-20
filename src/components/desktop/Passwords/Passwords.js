import React from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { Grid, Button } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import EmptyState from '../EmptyState'
import Password from '../Password'
import EditGroup from '../EditGroup'
import Group from '../../../model/Group'
import { getEmptyText } from '../../core/Passwords'
import { store } from '../../../store'
import { saveGroup } from '../../core/Group'

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 5,
    right: theme.spacing.unit * 5,
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  fabOpen: {
    transform: 'rotate(45deg)',
  },
  fabs: {
    fontSize: 16
  },
  fabGroup: {
    position: 'absolute',
    bottom: theme.spacing.unit * 14,
    right: theme.spacing.unit * 5,
    width: '100px',
    borderRadius: '19px',
    height: '35px'
  },
  fabPassword: {
    position: 'absolute',
    bottom: theme.spacing.unit * 20,
    right: theme.spacing.unit * 5,
    width: '130px',
    borderRadius: '19px',
    height: '35px'
  }
})

class Passwords extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf(['recent', 'all', 'filter'])
  }

  state = {
    fabOpen: false,
    editGroupOpen: false,
    passwords: []
  }

  changeLocation = (path, props) => this.props.history.push({
    pathname: path,
    state: {model: props},
  })

  /**
   * Closes the popup to add a group
   */
  handleClose = prop => event => {
    if(prop !== 'close') {
      const result = saveGroup(new Group(new Date().getTime(), prop), 'name')
      if(result === true) {
        this.setState({editGroupOpen: false})
      }
    } else {
      this.setState({editGroupOpen: false})
    }
  }

  /**
   * Filters the password by usage date. Currently the border is 30 days in the past
   * @returns Filtered passwords as Array
   */
  getPasswords = () => {
    const {mode, persistence: {passwords}} = this.props

    if(mode === 'recent')
      return passwords.filter(item => new Date(item.used) > new Date().setDate(new Date().getDate()-30))
    else if(mode === 'all')
      return passwords
    else if(mode === 'filter')
      return this.props.group.passwords
    else return []
  }

  render() {
    const { classes, mode } = this.props
    const passwords = this.getPasswords()

    return (
      <Grid container spacing={24}>
        {passwords.map((object, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Password
              model={object}
              name={object.name}
              username={object.username}
              password={object.password}
              validTill={object.validTill}
              used={object.used}
              notes={object.notes}
            />
          </Grid>
        ))}

        {(passwords.length === 0) && (
          <EmptyState text={getEmptyText(mode)} />
        )}

        <Button
          variant="fab"
          className={classNames(classes.fab, {
            [classes.fabOpen]: this.state.fabOpen,
          })}
          color="secondary"
          onClick={() => this.setState({fabOpen: !this.state.fabOpen})}
        >
          <Add />
        </Button>

        <EditGroup
          open={this.state.editGroupOpen}
          handleClose={this.handleClose}
          title="New group"
        />

        {
          this.state.fabOpen && (
            <Button
              variant="fab"
              className={classNames(classes.fabGroup, classes.fabs)}
              color="default"
              onClick={() => this.setState({fabOpen: false, editGroupOpen: true})}
            >
              Group
            </Button>
          )
        }

        {
          this.state.fabOpen && (
            <Button
              variant="fab"
              className={classNames(classes.fabPassword, classes.fabs)}
              color="default"
              onClick={() => {
                this.setState({fabOpen: false})
                this.changeLocation('/password/e', {})
              }}
            >
              Password
            </Button>
          )
        }
      </Grid>
    )
  }
}

const mapStateToProps = ({persistence}) => ({persistence})

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Passwords)))
