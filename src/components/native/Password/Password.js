import React from 'react'

import PropTypes from 'prop-types'
import NavigationService from '../../../service/native'
import ConfirmDialog from '../ConfirmDialog'
import { Card, CardItem, Button, Text, Body, Icon, Label, Grid, Row, View, Right, Input, Item, Textarea } from 'native-base'
import { StyleSheet } from 'react-native'
import { theme } from '../../../theme/theme.native'
import { connect } from 'react-redux'
import { getDateString, copy } from '../../core/Password'

const styles = StyleSheet.create({
  avatar: {
    fontSize: 18,
    paddingLeft: 0,
    paddingRight: 0,
  },
  avatarDefault: {
    color: 'black'
  },
  avatarWarning: {
    color: 'white'
  },
  avatarBackground: {
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBackgroundDefault: {
    backgroundColor: theme.palette.primary.dark
  },
  avatarBackgroundWarning: {
    backgroundColor: '#ffc107'
  },
  subtitle: {
    color: '#aaa'
  },
  headerAction: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    elevation: 0,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 30
  },
  password: {
    fontFamily: 'Monospace'
  },
  marginRow: {
    marginVertical: 3
  },
  marginGrid: {
    marginVertical: 6
  },
  border: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  text: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    width: '100%'
  },
  viewPassword: {
    marginHorizontal: 2,
    paddingHorizontal: 4
  },
  buttonRight: { marginLeft: 'auto' },
  fullWidth: { width: '100%' },
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  min: { flexGrow: 0 },
  max: { flexGrow: 1 },
})

class Password extends React.Component {
  static propTypes = {
    password: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    used: PropTypes.number.isRequired,
    notes: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    validTill: PropTypes.string.isRequired
  }

  state = {
    collapsed: true,
    collapsedNotes: true,
    passwordHidden: true,
    confirmOpen: false
  }

  /**
   * Checks if password is valid till now
   * @returns True if due date has not passed yet
   */
  isValid = validTill => {
    if(validTill === '' || validTill === undefined) return true

    return new Date(validTill) > new Date()
  }

  /**
   * Closes delete confirmation dialog
   */
  handleCancel = () => this.setState({confirmOpen: false})

  /**
   * Opens confirm dialog asking if user really wants to
   * delete the password.
   */
  onConfirmDelete = () => {
    const {adapter, model} = this.props
    adapter.deletePassword(model)
  }

  render(){
    const { model, model: {name, password, used, notes, username, validTill}, adapter } = this.props

    return (
      <Card>
        <ConfirmDialog
          title="Delete"
          message="Do you really want to delete the password?"
          handleCancel={this.handleCancel}
          handleAccept={this.onConfirmDelete}
          open={this.state.confirmOpen}
        />
        <CardItem style={styles.row}>
          <View style={styles.min}>
            <Button rounded style={[styles.avatarBackground, (this.isValid(validTill) ? styles.avatarBackgroundDefault : styles.avatarBackgroundWarning)]}>
              <Text style={[styles.avatar, (this.isValid(validTill) ? styles.avatarDefault : styles.avatarWarning)]}>&nbsp;{name.charAt(0)}&nbsp;</Text>
            </Button>
          </View>
          <View style={[styles.max, styles.column, {marginLeft: 10}]}>
            <Text>{name}</Text>
            <Text numberOfLines={1} style={styles.subtitle}>{`Used: ${getDateString(used, model)}`}</Text>
          </View>
          <View style={[styles.min, styles.row]}>
            <Button light onPress={() => NavigationService.navigate('PasswordStack', {model: model})} style={styles.headerAction}>
              <Icon style={styles.icon} name="create" />
            </Button>
            <Button light onPress={() => this.setState({collapsed: !this.state.collapsed})} style={[styles.headerAction]}>
              <Icon style={styles.icon} type="MaterialIcons" name={this.state.collapsed ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} />
            </Button>
          </View>
        </CardItem>

        { !this.state.collapsed && (
          <View>
            <CardItem bordered>
              <Body>
                <Grid style={styles.marginGrid}>
                  <Row style={styles.marginRow}><Label>Username:</Label></Row>
                  <Row style={[styles.marginRow, styles.row, styles.fullWidth, {alignItems: 'flex-start'}]}>
                    <Item>
                      <Input
                        style={styles.password}
                        value={username}
                      />
                      <Icon
                        style={styles.icon}
                        active
                        name="clipboard"
                        onPress={copy(username, model)}
                      />
                    </Item>
                  </Row>
                </Grid>

                <Grid style={styles.marginGrid}>
                  <Row style={styles.marginRow}><Label>Password:</Label></Row>
                  <Row style={[styles.marginRow, styles.row, styles.fullWidth, {alignItems: 'flex-start'}]}>
                    <Item>
                      <Input
                        style={styles.password}
                        value={(this.state.passwordHidden) ? '●●●●●●●●●●●●●●●●●' : password}
                      />
                      <Icon
                        style={styles.icon}
                        active
                        name="clipboard"
                        onPress={copy(password, model)}
                      />
                      <Icon
                        style={styles.icon}
                        active
                        name={(this.state.passwordHidden) ? 'eye' : 'eye-off'}
                        onPress={() => this.setState({passwordHidden: !this.state.passwordHidden})}
                      />
                    </Item>
                  </Row>
                </Grid>
              </Body>
            </CardItem>
            <CardItem button bordered onPress={() => this.setState({collapsedNotes: !this.state.collapsedNotes})}>
              <Text>Expand notes</Text>
              <Icon type="MaterialIcons" style={styles.buttonRight} name={this.state.collapsedNotes ? 'keyboard-arrow-down' : 'keyboard-arrow-up'} />
            </CardItem>
            { this.state.collapsedNotes === false && (
              <CardItem>
                <Body>
                  <Grid style={styles.marginGrid}>
                    <Row style={styles.marginRow}><Label>Notes:</Label></Row>
                    <Row style={styles.marginRow}><Text style={styles.text}>{notes}</Text></Row>
                  </Grid>
                </Body>
              </CardItem>
            )}
            <CardItem>
              <Text></Text>
              <Button light style={[styles.buttonRight, styles.headerAction]} onPress={() => this.setState({confirmOpen: !this.state.confirmOpen})}>
                <Icon style={styles.icon} type="MaterialIcons" name="delete" />
              </Button>
            </CardItem>
          </View>
        )}
      </Card>
    )
  }
}

const mapStateToProps = ({persistence: {adapter}}) => ({adapter})

export default connect(mapStateToProps)(Password)
