import React from 'react'

import { connect } from 'react-redux'
import { Separator, Icon } from 'native-base'
import { Message as MessageAction } from '../../../store/actions/Message'
import { SafeAreaView } from 'react-navigation'
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Clipboard from '../../../modules/clipboard'
import Notification from '../../../modules/notification'
import GenerateRandom from '../GenerateRandom'
import PropTypes from 'prop-types'
import DrawerItem from '../DrawerItem'
import NavigationService from '../../../service/native'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: 2
  },
  textItem: {
    paddingVertical: 4
  },
  textActive: {
    margin: 16,
    fontWeight: 'bold',
  },
  textDisabled: {
    margin: 16
  },
  // Style for password generator
  icon: {
    marginLeft: 19,
    marginRight: 13,
    width: 24,
    alignItems: 'center',
    opacity: 0.62,
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,.87)'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

class DrawerItems extends React.Component {
  static propTypes = {
    navigationProps : PropTypes.object.isRequired
  }

  state = {
    generateOpen: false
  }

  /**
   * Renders group button component as drawer item
   * @param {Object} group Group instance
   * @param {Integer} key Index of component
   * @returns Group button
   */
  getGroupButton = (group, key) => (
    <TouchableOpacity key={key} style={styles.textItem} onPress={() => NavigationService.navigate('GroupStack', {group})}>
      <View>
        <Text style={styles.textActive}>{group.name}</Text>
      </View>
    </TouchableOpacity>
  )

  /**
   * Renders drawer item to open the
   * popup to generate a random password.
   * @returns Drawer item
   */
  getGeneratePassword = () => (
    <GenerateRandom
      open={this.state.generateOpen}
      handleClose={this.handleClose}
      descriptionText="Copy the password to the clipboard by clicking on 'Copy'."
      submitText="Copy"
    />
  )

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
   * Opens popup to generate new random password
   */
  handleGeneratePassword = () => {
    this.props.navigationProps.navigation.closeDrawer()
    this.setState({generateOpen: true})
  }

  render() {
    const { navigationProps, groups } = this.props

    return (
      <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
          { this.getGeneratePassword() }
          { navigationProps.items.map((route, index) => {
            // Add groups after allpasswords entry
            if(route.key === 'allPasswords') {
              return (
                <View key={index}>
                  <DrawerItem {...navigationProps} route={route} index={index} />
                  <Separator style={styles.separator}/>
                  { groups.map((item, key) => {
                    return this.getGroupButton(item, key)
                  }) }
                  { groups.length === 0 && (
                    <TouchableOpacity style={styles.textItem}>
                      <View>
                        <Text style={styles.textDisabled}>Created groups will be listed here</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  <Separator style={styles.separator}/>
                  <TouchableOpacity style={styles.item} onPress={this.handleGeneratePassword}>
                    <View><Icon name="lock" size={20} style={styles.icon} /></View>
                    <View><Text style={styles.label}>Generate password</Text></View>
                  </TouchableOpacity>
                </View>
              )
            } else {
              return <DrawerItem key={index} {...navigationProps} route={route} index={index} />
            }
          }) }
        </SafeAreaView>
      </ScrollView>
    )
  }
}

const mapStateToProps = ({persistence: {groups}}) => ({groups})

export default connect(mapStateToProps)(DrawerItems)
