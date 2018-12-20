import React from 'react'
import { Button, Spinner, View, Text, Icon } from 'native-base'
import { StyleSheet } from 'react-native'
import { theme } from '../../../../theme/theme.native'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.palette.secondary.main
  }
})

class Finish extends React.Component {
  static propTypes = {
    onStart: PropTypes.func.isRequired
  }

  state = {
    loading: false
  }

  click = () => {
    const {onStart} = this.props
    this.setState({loading: true}, () => onStart())
  }

  render() {
    return (
      <View>
        {(this.state.loading) && <Spinner color={theme.palette.secondary.main} />}
        <Button rounded success onPress={(this.state.loading === false) ? this.click : null} style={styles.button}>
          <Icon name="phonelink-lock" type="MaterialIcons"/>
          <Text>Start Safeword</Text>
        </Button>
      </View>
    )
  }
}

export default Finish
