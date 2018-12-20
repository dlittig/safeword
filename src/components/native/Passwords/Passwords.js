import React from 'react'
import { Container, Content, View, Grid, Col, Row, Icon, Fab, Button, Text } from 'native-base'
import { StyleSheet, ScrollView } from 'react-native'
import Password from '../Password'
import EditGroup from '../EditGroup'
import EmptyState from '../EmptyState'
import Group from '../../../model/Group'
import { connect } from 'react-redux'
import { getEmptyText } from '../../core/Passwords'

import { theme } from '../../../theme/theme.native'
import NavigationService from '../../../service/native'
import fs from '../../../modules/filesystem'
import { saveGroup } from '../../core/Group'

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: 'transparent'
  },
  password: {
    marginHorizontal: 10,
    marginVertical: 5
  },
  passwordButton: {
    backgroundColor: '#3B5998',
    width: 120,
    marginHorizontal: -80
  },
  groupButton: {
    backgroundColor: '#E0E0E0',
    width: 100,
    marginHorizontal: -60
  },
  fab: {
    backgroundColor: theme.palette.secondary.main,
    transform: [{
      rotate: '0deg',
    }]
  },
  fabExpanded: {
    transform: [{
      rotate: '45deg'
    }]
  }
})

class Passwords extends React.Component {
  state = {
    active: false,
    editGroupOpen: false
  }

  /**
   * Filters the password by usage date. Currently the border is 30 days in the past
   * @returns Filtered passwords as Array
   */
  getPasswords = () => {
    const {mode, passwords} = this.props

    if(mode === 'recent')
      return passwords.filter(item => new Date(item.used) > new Date().setDate(new Date().getDate()-30))
    else if(mode === 'all')
      return passwords
    else if(mode === 'filter')
      return this.props.group.passwords
    else return []
  }

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

  render() {
    const passwords = this.getPasswords()
    console.log(passwords)
    const {mode} = this.props

    return (
      <Container style={styles.container}>
        <Content>
          { passwords.map((password, i) => (
            <View key={i} style={styles.password}>
              <Password
                model={password}
                name={password.name}
                username={password.username}
                password={password.password}
                validTill={password.validTill}
                used={password.used}
                notes={password.notes}
              />
            </View>
          ))}
          { passwords.length === 0 && (
            <EmptyState text={getEmptyText(mode)} />
          )}
        </Content>

        <EditGroup
          open={this.state.editGroupOpen}
          handleClose={this.handleClose}
          title="New group"
        />

        <Fab
          active={this.state.active}
          direction="up"
          style={[styles.fab, (this.state.active === true) ? styles.fabExpanded : null]}
          position="bottomRight"
          onPress={() => this.setState({ active: !this.state.active })}
        >
          <Icon name="add" />
          {
            this.state.active && (
              <Button light style={styles.groupButton} onPress={() => this.setState({editGroupOpen: true, active: !this.state.active})}>
                <Text>Group</Text>
              </Button>
            )
          }
          {
            this.state.active && (
              <Button style={styles.passwordButton} onPress={() => this.setState({active: !this.state.active}, () => NavigationService.navigate('PasswordStack', {model: {}})) }>
                <Text>Password</Text>
              </Button>
            )
          }
        </Fab>
      </Container>
    )
  }
}

const mapStateToProps = ({persistence: {passwords, adapter}}) => ({passwords, adapter})

export default connect(mapStateToProps)(Passwords)
