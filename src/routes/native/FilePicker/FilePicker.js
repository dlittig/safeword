import React from 'react'

import { connect } from 'react-redux'
import { List, ListItem, Icon, Text, Left, Body, Separator, Button, Content } from 'native-base'
import { theme } from '../../../theme/theme.native'
import { StyleSheet } from 'react-native'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'
import fs from '../../../modules/filesystem'
import NavigationService from '../../../service/native/NavigationService'
import rnfs from 'react-native-fs'

const styles = StyleSheet.create({
  info: {
    fontSize: 14
  }
})

class FilePicker extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerRightContainerStyle: {
      marginRight: 20
    },
    headerStyle: {
      backgroundColor: theme.palette.primary.main,
      elevation: 10
    },
    headerRight:
      <Button transparent rounded>
        <Icon
          style={{color: theme.palette.primary.contrastText, marginTop: 10}}
          name="checkmark"
          size={20}
          onPress= {() => {
            navigation.state.params.filePickerOnSelectCallback()
            navigation.setParams({filePickerOnSelectCallback: undefined})
            NavigationService.back()
          }}
        />
      </Button>
  })

  state = {
    contents : [],
    dir: rnfs.ExternalStorageDirectoryPath
  }

  /**
   * Fetches content of current directory. Saves content to state
   */
  fetchDirContents = () => {
    fs.readDir(this.state.dir).then(result => {
      const dirContent = []
      result.map(item => {
        if(item.isDirectory === true) item.onPress = this.handleAccess(item)
        else item.onPress = null

        dirContent.push(item)
      })
      this.setState({contents: result})
    }).catch(error => {
      this.setState({dir: rnfs.ExternalStorageDirectoryPath, contents: []})
    })
  }

  componentDidMount() {
    this.fetchDirContents()
    this.props.navigation.setParams({filePickerOnSelectCallback: this.handleSelection.bind(this)})
  }

  componentDidUpdate(prevProps, prevState) {
    // After handle access this will be called
    // get the new dir and fetch to contents
    if(prevState.dir !== this.state.dir) {
      // now fetch
      this.fetchDirContents()
    }
  }

  /**
   * Selects the current directory as destination
   */
  handleSelection = () => {
    const { navigation } = this.props
    navigation.state.params.onSelect(this.state.dir)
  }

  /**
   * Handles the select event of a directory.
   */
  handleAccess = item => () => {
    const dir = `${this.state.dir}/${item.name}`
    // Check if item is dir. If dir then move one layer deeper and update this.state.dir, clear state.dir.contents
    this.setState({dir, contents: []})
  }

  /**
   * Handles the up navigation event
   */
  handleUp = () => {
    const path = this.state.dir.split('/')
    path.pop()
    let dir = ''
    path.map((item, index) => {
      if(index+1 < path.length)
        dir += `${item}/`
      else dir += item
    })
    this.setState({dir, contents: []})
  }

  render() {
    return (
      <InfoAwareRouteComponent>
        <Content>
          <List>
            <Separator bordered>
              <Text style={styles.info}>Path: {this.state.dir}</Text>
            </Separator>
            <ListItem icon onPress={this.handleUp}>
              <Left><Icon name="arrow-up"/></Left>
              <Body><Text>Navigate up</Text></Body>
            </ListItem>
            <Separator bordered>
              <Text style={styles.info}>Content</Text>
            </Separator>

            {this.state.contents.map((item, key) => (
              <ListItem icon onPress={item.onPress} key={key}>
                <Left><Icon name={item.isDirectory === true ? 'folder' : 'document' }></Icon></Left>
                <Body><Text>{item.name}</Text></Body>
              </ListItem>
            ))}

            {this.state.contents.length === 0 && (
              <ListItem>
                <Text>Directory is empty.</Text>
              </ListItem>
            )}
          </List>
        </Content>
      </InfoAwareRouteComponent>
    )
  }
}

export default connect()(FilePicker)
