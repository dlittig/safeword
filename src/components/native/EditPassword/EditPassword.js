import React from 'react'

import { Picker, Form, Item, Label, Input, Fab, Text, Icon, View, DatePicker } from 'native-base'
import { StyleSheet, ScrollView } from 'react-native'
import { theme } from '../../../theme/theme.native'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import GenerateRandom from '../GenerateRandom'
import Random from '../../../modules/random'
import { matchesProfile } from '../../core/Password'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  form: {
    marginRight: 16
  },
  picker: {
    marginLeft: 16
  },
  label: {
    marginLeft: 16,
    marginTop: 16
  },
  icon: {
    marginHorizontal: 6
  },
  date: {
    marginVertical: 24
  },
  password: {
    fontFamily: 'Monospace'
  },
  borderless: {
    marginTop: 8,
    borderBottomWidth: 0,
    borderColor: 'transparent',
  },
  errorText: {
    color: '#ff9800'
  },
})

class EditPassword extends React.Component {
  state = {
    name: '',
    username: '',
    password: '',
    notes: '',
    validTill: '',
    editGenerateOpen: false,
    group: ''
  }

  /**
   * Handles text change in this component and
   * delegates changes to the parent component
   */
  onTextChange = (key, value) => {
    this.setState({[key]: value})
    this.props.handleStateChange(key, value)
  }

  /**
   * Handle selection of group
   */
  onGroupChange = prop => {
    console.log('group change', prop)
    this.setState({group: prop})
    this.props.handleStateChange('group', prop)
  }

  /**
   * Generate a new default password when the user clicks on the refresh icon
   */
  onRefresh = async () => this.setState({password: await Random.getDefaultPassword()})

  componentDidMount() {
    const model = this.props.navigation.getParam('model', {})
    this.setState({
      name: model.name || '',
      username: model.username || '',
      password: model.password || '',
      notes: model.notes || '',
      group: (model.hasGroup && model.hasGroup()) ? model.group.name : '',
      validTill: model.validTill || ''
    }, () => {
      if(this.state.password === '')
        Random.getDefaultPassword().then(result => this.setState({password: result}, () => this.props.handleStateChange('password', result)))
    })
  }

  /**
   * Handle close of password generator popup
   */
  handleClose = prop => event => {
    this.setState({editGenerateOpen: false})

    if(prop !== 'close') {
      this.setState({password: prop}, () => this.props.handleStateChange('password', prop))
    }
  }

  render() {
    const { groups } = this.props

    return (
      <View style={styles.container} contentContainerStyle={styles.container}>
        <ScrollView>
          <GenerateRandom
            open={this.state.editGenerateOpen}
            handleClose={this.handleClose}
            descriptionText="Insert the passwort into the input field by clicking on 'Select'."
            submitText="Select"
          />
          <Form style={styles.form}>
            <Item floatingLabel>
              <Label>Name</Label>
              <Input
                value={this.state.name}
                onChangeText={text => this.onTextChange('name', text)}
              />
            </Item>

            <Item floatingLabel>
              <Label>Username</Label>
              <Input
                value={this.state.username}
                onChangeText={text => this.onTextChange('username', text)}
              />
            </Item>

            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                style={styles.password}
                value={this.state.password}
                onChangeText={text => this.onTextChange('password', text)}
              />
              <Icon
                style={styles.icon}
                active
                name="refresh"
                onPress={this.onRefresh}
              />
              <Icon
                style={styles.icon}
                active
                name="create"
                onPress={() => this.setState({editGenerateOpen: !this.state.editGenerateOpen})}
              />
            </Item>

            {matchesProfile(this.state.password) && (
              <Item style={styles.borderless}>
                <Text style={styles.errorText}>This password matches the Profile and is therefore insecure.</Text>
              </Item>
            )}

            <Item style={styles.date}>
              <DatePicker
                defaultDate={this.state.validTill === '' ? new Date() : this.state.validTill}
                minimumDate={new Date()}
                locale={'en'}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                placeHolderText={this.state.validTill === '' ? 'Valid till' : this.state.validTill}
                placeHolderTextStyle={{ color: '#777' }}
                textStyle={{ color: '#333' }}
                onDateChange={date => this.onTextChange('validTill', date.toDateString())}
              />
            </Item>

            <Label style={styles.label}>Group</Label>
            <Item picker style={styles.picker}>
              <Picker
                mode="dialog"
                prompt="Group"
                selectedValue={this.state.group}
                onValueChange={this.onGroupChange.bind(this)}
              >
                <Picker.Item key={-1} label="None" value={''} disabled enabled={false} />
                {
                  groups.map((element, index) => (
                    <Picker.Item key={index} label={element.name} value={element.name} />
                  ))
                }
              </Picker>
            </Item>

            <Item floatingLabel>
              <Label>Notes</Label>
              <Input
                value={this.state.notes}
                multiline={true}
                numberOfLines={5}
                onChangeText={text => this.onTextChange('notes', text)}
              />
            </Item>
          </Form>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = ({persistence: {groups}}) => ({groups})
export default connect(mapStateToProps)(withNavigation(EditPassword))
