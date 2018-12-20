import React from 'react'

import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { WatchLater, SettingsSharp as Settings, Info, Bookmark, Lock } from '@material-ui/icons'
import GenerateRandom from '../GenerateRandom'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Notification from '../../../modules/notification'
import Clipboard from '../../../modules/clipboard'
import { Message as MessageAction } from '../../../store/actions/Message'

const style = theme => ({
  toolbar: theme.mixins.toolbar,
  active: {
    '& span': {
      fontWeight: 'bold'
    }
  }
})

class DrawerItems extends React.Component {
  state = {
    generateOpen: false
  }

  changeLocation = (path, props) => this.props.history.push({
    pathname: path,
    state: {group: props}
  })

  /**
   * Handle event when GeneratePassword popup closes.
   * Copies the password to clipboard and displays a notification after 20 secs.
   */
  handleClose = prop => event => {
    this.setState({generateOpen: false})
    if(prop !== 'close') {
      // Copy to clipboard
      const {dispatch} = this.props
      Clipboard.copy(prop, {
        wipe: true,
        callback: () => Notification.set('Sensitive information has been removed from clipboard.'),
        duration: 20000
      })
      dispatch(MessageAction.set('Copied to clipboard.'))
    }
  }

  /**
   * Get style of an active drawer item
   * @returns Style of active item
   */
  getStyle = route => (this.props.location.pathname === route) ? this.props.classes.active : null

  /**
   * Opens popup to generate new random password
   */
  handleGeneratePassword = () => {
    this.props.onSelect()
    this.setState({generateOpen: true})
  }

  render() {
    const { classes, groups } = this.props

    return (
      <div>
        <div className={classes.toolbar} />
        <GenerateRandom
          open={this.state.generateOpen}
          handleClose={this.handleClose}
          descriptionText="Copy the password to the clipboard by clicking on 'Copy'."
          submitText="Copy"
        />
        <Divider />
        <List>
          <ListItem button onClick={() => this.changeLocation('/passwords/recent')}>
            <ListItemIcon>
              <WatchLater />
            </ListItemIcon>
            <ListItemText primary="Recently used" className={this.getStyle('/passwords/recent')}/>
          </ListItem>
        </List>
        <List>
          <ListItem button onClick={() => this.changeLocation('/passwords/all')}>
            <ListItemText primary={'All passwords'} className={this.getStyle('/passwords/all')} />
          </ListItem>
        </List>
        <Divider />
        <List>
          {groups.map((group, i) => (
            <ListItem button key={i} onClick={() => this.changeLocation(`/group/passwords/${i}`, group)}>
              <ListItemText primary={group.name} />
            </ListItem>
          ))}

          {(groups.length === 0 && (
            <ListItem disabled button>
              <ListItemText primary={'Created groups will be listed here'} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={this.handleGeneratePassword}>
            <ListItemIcon>
              <Lock />
            </ListItemIcon>
            <ListItemText primary="Generate password"/>
          </ListItem>
          <ListItem button onClick={() => this.changeLocation('/groups')}>
            <ListItemIcon>
              <Bookmark />
            </ListItemIcon>
            <ListItemText primary="Manage groups" className={this.getStyle('/groups')}/>
          </ListItem>
          <ListItem button onClick={() => this.changeLocation('/settings')}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" className={this.getStyle('/settings')}/>
          </ListItem>
          <ListItem button onClick={() => this.changeLocation('/about')}>
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary="About" className={this.getStyle('/about')}/>
          </ListItem>
        </List>
      </div>
    )
  }
}

const mapStateToProps = ({persistence: {groups}}) => ({groups})

export default connect(mapStateToProps)(withRouter(withStyles(style, {withTheme: true})(DrawerItems)))
