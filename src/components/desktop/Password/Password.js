import React from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { Avatar, Button, Card, CardHeader, CardContent, Input, InputAdornment, InputLabel, FormControl, TextField, IconButton, Collapse } from '@material-ui/core'
import { Visibility, VisibilityOff, Create, ExpandMore, FileCopy, Delete } from '@material-ui/icons'
import Clipboard from '../../../modules/clipboard'
import ConfirmDialog from '../ConfirmDialog'
import Notification from '../../../modules/notification'
import { getDateString, copy } from '../../core/Password'

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: theme.palette.primary.dark,
    color: 'black'
  },
  avatarWarning: {
    backgroundColor: '#ffc107',
    color: 'white'
  },
  margin: {
    margin: theme.spacing.unit,
  },
  passwordField: {
    width: '100%',
    marginTop: '10px',
    '& input' : {
      fontFamily : 'Courier, monospace'
    }
  },
  textField: {
    width: '100%'
  },
  expandNotes: {
    marginTop: theme.spacing.unit * 2
  },
  header: {
    '& span': {
      wordBreak: 'break-all'
    }
  },
  row: {
    display: 'inline-flex'
  },
  button: {
    color: 'rgba(0, 0, 0, 0.54)',
    float: 'right',
    margin: '15px 0 20px 0'
  }
})

class Password extends React.Component {
  state = {
    expanded: false,
    expandedNotes: false,
    showPassword: false,
    confirmOpen: false
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    used: PropTypes.number.isRequired,
    notes: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    validTill: PropTypes.string.isRequired
  }

  /**
   * Toggle the password card
   */
  handleExpandClick = () => this.setState({ expanded: !this.state.expanded })

  /**
   * Prevent bubbling of event after clicking button in password input
   */
  handleMouseDownPassword = event => event.preventDefault()

  /**
   * Shows the obfuscated password as plaintext
   */
  handleClickShowPassword = () => this.setState({ showPassword: !this.state.showPassword })

  changeLocation = (path, props) => this.props.history.push({
    pathname: path,
    state: {model: props}
  })

  /**
   * Checks if a password is still valid
   * @returns True if lifetime has not passed the due date yet
   */
  isValid = validTill => {
    if(validTill === '' || validTill === undefined) return true

    return new Date(validTill) > new Date()
  }

  /**
   * Cancel deletion
   */
  handleCancel = () => this.setState({confirmOpen: false})

  /**
   * Delete the entity
   */
  onConfirmDelete = () => {
    const { model, adapter } = this.props
    this.setState({confirmOpen: false})
    adapter.deletePassword(model)
  }

  render() {
    const { classes, model, name, password, used, notes, username, validTill } = this.props
    console.log('render pw', model.name)

    return (
      <Card>
        <ConfirmDialog
          title="Delete"
          message="Do you really want to delete the password?"
          handleCancel={this.handleCancel}
          handleAccept={this.onConfirmDelete}
          open={this.state.confirmOpen}
        />
        <CardHeader
          className={classes.header}
          avatar={
            <Avatar aria-label="Recipe" className={(this.isValid(validTill)) ? classes.avatar : classes.avatarWarning}>
              {name.charAt(0)}
            </Avatar>
          }
          action={
            <div>
              <IconButton
                aria-label="Edit"
                onClick={() => {this.changeLocation('/password/e', model)}}
              >
                <Create />
              </IconButton>
              <IconButton
                className={classNames(classes.expand, {
                  [classes.expandOpen]: this.state.expanded,
                })}
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
                aria-label="Show more"
              >
                <ExpandMore />
              </IconButton>
            </div>
          }
          title={name}
          subheader={`Used: ${getDateString(used)}`}
        />
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <FormControl className={classes.textField}>
              <InputLabel htmlFor="username-form">Username</InputLabel>
              <Input
                id="username-form"
                disabled
                type="text"
                value={model.username}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Copy to clipboard"
                      onClick={copy(username, model)}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      <FileCopy />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl className={classes.passwordField}>
              <InputLabel htmlFor="password-form">Password</InputLabel>
              <Input
                id="password-form"
                disabled
                type={this.state.showPassword ? 'text' : 'password'}
                value={password}
                endAdornment={
                  <div className={classes.row}>
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Copy to clipboard"
                        onClick={copy(password, model)}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        <FileCopy />
                      </IconButton>
                    </InputAdornment>
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  </div>
                }
              />
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              className={classes.expandNotes}
              onClick={() => this.setState({expandedNotes: !this.state.expandedNotes})}
            >
                Expand notes
              <ExpandMore
                className={classNames(classes.expand, {
                  [classes.expandOpen]: this.state.expandedNotes,
                })}
              />
            </Button>
            <Collapse in={this.state.expandedNotes}>
              <TextField
                fullWidth
                label="Notes"
                type="text"
                margin="normal"
                multiline
                rows="4"
                value={notes}
              />
            </Collapse>
            <IconButton
              className={classes.button}
              size="small"
              onClick={() => this.setState({confirmOpen: true})}
            >
              <Delete />
            </IconButton>
          </CardContent>
        </Collapse>
      </Card>
    )
  }
}

const mapStateToProps = ({persistence: {adapter}}) => ({adapter})

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Password)))
