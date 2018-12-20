import React from 'react'

import { Icon, Fab } from 'native-base'
import { StyleSheet } from 'react-native'
import { theme } from '../../../theme/theme.native'
import { connect } from 'react-redux'
import { isObjectEmpty } from '../../../utils'
import { savePassword } from '../../../components/core/Password'
import EditPassword from '../../../components/native/EditPassword'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'
import PasswordModel from '../../../model/Password'
import NavigationService from '../../../service/native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.primary.main
  },
  fab: {
    backgroundColor: theme.palette.secondary.main
  }
})

class Password extends React.Component {
  state = {
    model : {},
    type: 'edit'
  }

  static navigationOptions = ({navigation}) => ({
    title: 'Edit password',
    headerStyle: { backgroundColor: theme.palette.primary.main },
    headerTintColor: theme.palette.primary.contrastText,
    headerLeft: (
      <Icon
        name="arrow-back"
        size={30}
        style={{marginLeft: 20, color: theme.palette.primary.contrastText}}
        onPress={() => NavigationService.back()}
      />
    )
  })

  UNSAFE_componentWillMount() {
    const { navigation } = this.props
    const model = navigation.state.params.model
    let oldModel = {}

    if(!isObjectEmpty(model)) {
      oldModel = model.clone()
      oldModel.group = oldModel.group.clone()
    }

    this.setState({
      model,
      oldModel,
      type: isObjectEmpty(model) ? 'new' : 'edit'
    })
  }

  /**
   * Saves the password. If sync is enabled a sync is being performed.
   */
  onSave = () => {
    const {model, type, oldModel} = this.state
    savePassword(
      model,
      oldModel,
      type,
      () => this.setState({model: {}}, () => NavigationService.back())
    )
  }

  /**
   * Handler when password properties change
   */
  handleStateChange = (key, value) => {
    this.setState({
      model: Object.assign({}, this.state.model, {
        [key]: value
      })
    })
  }

  render() {
    return (
      <InfoAwareRouteComponent style={styles.container}>
        <EditPassword model={this.state.model} handleStateChange={this.handleStateChange}/>
        <Fab
          position="bottomRight"
          style={styles.fab}
          onPress={() => this.onSave()}
        >
          <Icon name="checkmark" />
        </Fab>
      </InfoAwareRouteComponent>
    )
  }
}

const mapStateToProps = ({persistence}) => ({persistence})

export default connect(mapStateToProps)(Password)
