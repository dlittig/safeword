import React from 'react'

import { Item, Picker, View, Text } from 'native-base'
import { StyleSheet } from 'react-native'
import { persistenceAdapters } from '../../../../adapters'
import OpenPgp from './OpenPgp'
import Rx from './Rx'
import PropTypes from 'prop-types'
import { OpenpgpAdapter, RxAdapter } from '../../../../adapters/persistence'

const styles = StyleSheet.create({
  container: {
    width: '85%'
  }
})

export default class SetupForm extends React.Component {
  state = {
    type: 0,
    additional: {}
  }

  static propTypes = {
    handleChange: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    additional: PropTypes.object.isRequired
  }

  componentDidMount() {
    const {type, additional} = this.props
    this.setState({
      type,
      additional
    })
  }

  /**
   * Handles type change
   */
  handleChange = prop => {
    if(prop !== this.state.type) {
      this.setState({additional: {}})
      this.props.handleChange('additional', {})
    }

    this.setState({ type: prop })
    this.props.handleChange('type', prop)
  }

  /**
   * Handles change event, when an adapter changes additional props
   */
  handleAdditional = (key, value) => {
    this.setState({additional: Object.assign({}, this.state.additional, {[key]: value})}, () => {
      this.props.handleChange('additional', this.state.additional)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Item picker>
          <Picker
            mode="dialog"
            prompt="Persist with..."
            //onValueChange={this.change}
            selectedValue={this.state.type}
            onValueChange={this.handleChange.bind(this)}
          >
            <Picker.Item key={-1} label="Nothing selected" value={0} disabled enabled={false} />
            {
              persistenceAdapters.map((element, index) => (
                <Picker.Item key={index} label={element.describe()} value={element.describe()} />
              ))
            }
          </Picker>
        </Item>

        { this.state.type === OpenpgpAdapter.description && (
          <OpenPgp additional={this.state.additional} handleAdditional={this.handleAdditional} />
        )}

        { this.state.type === RxAdapter.description && (
          <Rx additional={this.state.additional} handleAdditional={this.handleAdditional} />
        )}
      </View>
    )
  }
}
