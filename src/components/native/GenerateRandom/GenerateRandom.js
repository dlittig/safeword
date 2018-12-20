import React from 'react'

import PropTypes from 'prop-types'
import { StyleSheet, Switch } from 'react-native'
import { View, Text, Row, Form, Item, Label, Input, Left, Right } from 'native-base'
import { ConfirmDialog } from 'react-native-simple-dialogs'
import Random from '../../../modules/random'
import { theme } from '../../../theme/theme.native'

const styles = StyleSheet.create({
  form: {
    marginVertical: 10
  },
  password: {
    fontFamily: 'Monospace'
  },
  length: {
    width: 150
  },
  item: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'transparent',
    marginVertical: 6,
    marginLeft: 0
  },
  label: {
    marginTop: 10
  }
})

class GenerateRandom extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    descriptionText: PropTypes.string.isRequired,
    submitText: PropTypes.string.isRequired
  }

  state = {
    password: '',
    alphaLow: true,
    alphaUp: true,
    num: true,
    special: true,
    length: '32'
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.open === false) {
      this.setState({password: ''})
    } else if(nextProps.open === true && this.props.open === false) {
      this.generatePassword()
    }
  }

  componentDidMount() {
    this.generatePassword()
  }

  /**
   * Generates a password with the passed properties and saves it to state
   */
  generatePassword = () => {
    Random.get(this.getCharset(), parseInt(this.state.length)).then(result => {
      this.setState({password: result})
    })
  }

  /**
   * Generates a charset string with the preferences of the user.
   * @returns Charset string
   */
  getCharset = () => {
    let result = ''
    if(this.state.alphaLow === true) result += Random.ALPHA_LOW
    if(this.state.alphaUp === true) result += Random.ALPHA_UP
    if(this.state.num === true) result += Random.NUM
    if(this.state.special === true) result += Random.SPECIAL

    return result
  }

  /**
   * Handle event when the length of the password changes
   */
  handleNumber = (key, value) => event => this.setState({ [key]: value ? value: '0' }, () => this.generatePassword())

  /**
   * Handle event when a text field changes its contents
   */
  handleChange = (key, value) => event => this.setState({ [key]: value }, () => this.generatePassword())

  /**
   * Handle event when one of the toggle switches changes state
   */
  handleToggle = prop => value => this.setState({ [prop]: value}, () => this.generatePassword())

  /**
   * Handles toggle event, but also reacts if the user wishes
   * to change the toggle state by clicking on the label
   */
  handleAreaToggle = prop => event => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ [prop]: !this.state[prop]}, () => this.generatePassword())
  }

  /**
   * Handle close event of this component.
   */
  handleClose = props => event => {
    const { handleClose } = this.props
    if(props === 'close') {
      this.setState({
        password: '',
        alphaLow: true,
        alphaUp: true,
        num: true,
        special: true,
        length: '32'
      })
    }
    handleClose(props)(event)
  }

  render() {
    const { open, descriptionText, submitText } = this.props
    const text = `Enter the name of the group in the text field below. ${descriptionText}`

    return (
      <ConfirmDialog
        title="Generate password"
        visible={open}
        onTouchOutside={this.handleClose('close')}
        positiveButton={{
          title: submitText,
          onPress: this.handleClose(this.state.password),
          titleStyle: {
            color: theme.palette.secondary.main
          }
        }}
        negativeButton={{
          title: 'Cancel',
          onPress: this.handleClose('close'),
          titleStyle: {
            color: theme.palette.secondary.main
          }
        }}
      >
        <View>
          <Text>{text}</Text>

          <View style={styles.form}>
            <Item floatingLabel style={styles.length}>
              <Label style={[styles.label]}>Password length</Label>
              <Input
                keyboardType="numeric"
                value={this.state.length}
                onChangeText={text => this.handleNumber('length', text)()}
              />
            </Item>

            <Item style={styles.item} onPress={this.handleAreaToggle('alphaLow')}>
              <Switch onValueChange={this.handleToggle('alphaLow')} value={this.state.alphaLow} />
              <Text>Alphabetic lowercase</Text>
            </Item>

            <Item style={styles.item} onPress={this.handleAreaToggle('alphaUp')}>
              <Switch value={this.state.alphaUp} onValueChange={this.handleToggle('alphaUp')} />
              <Text>Alphabetic uppercase</Text>
            </Item>

            <Item style={styles.item} onPress={this.handleAreaToggle('num')}>
              <Switch value={this.state.num} onValueChange={this.handleToggle('num')} />
              <Text>Numeric</Text>
            </Item>

            <Item style={styles.item} onPress={this.handleAreaToggle('special')}>
              <Switch value={this.state.special} onValueChange={this.handleToggle('special')} />
              <Text>Special characters</Text>
            </Item>

            <Item floatingLabel>
              <Label  style={styles.label}>Generated password</Label>
              <Input
                value={this.state.password}
                onChangeText={this.handleChange('password', text)}
                style={styles.password}
              />
            </Item>
          </View>
        </View>
      </ConfirmDialog>
    )
  }
}

export default GenerateRandom
