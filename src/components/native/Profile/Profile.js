import React from 'react'

import { Form, Label, Input, DatePicker, Item } from 'native-base'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    width: '85%'
  },
  margin: {
    marginTop: 20
  }
})

class Profile extends React.Component {
  static propTypes = {
    handleChange: PropTypes.func.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    birthday: PropTypes.string.isRequired
  }

  state = {
    firstname: '',
    lastname: '',
    birthday: ''
  }

  componentDidMount() {
    const {firstname, lastname, birthday} = this.props
    this.setState({
      firstname,
      lastname,
      birthday
    })
  }

  handleChange = (key, value) => {
    this.setState({[key]: value})
    this.props.handleChange(key, value)
  }

  render() {
    return (
      <Form style={styles.container}>
        <Item floatingLabel>
          <Label>Firstname</Label>
          <Input
            value={this.state.firstname}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={text => this.handleChange('firstname', text)}
          />
        </Item>
        <Item floatingLabel>
          <Label>Lastname</Label>
          <Input
            value={this.state.lastname}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={text => this.handleChange('lastname', text)}
          />
        </Item>
        <Item style={styles.margin}>
          <DatePicker
            defaultDate={this.state.birthday === '' ? new Date() : this.state.birthday}
            maximumDate={new Date()}
            locale={'en'}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={'fade'}
            androidMode={'default'}
            placeHolderText={this.state.birthday === '' ? 'Birthday' : this.state.birthday}
            placeHolderTextStyle={{ color: '#777' }}
            textStyle={{ color: '#333' }}
            onDateChange={date => this.handleChange('birthday', date.toDateString())}
          />
        </Item>
      </Form>
    )
  }
}

export default Profile
