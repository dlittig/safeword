import React from 'react'

import { View, Form, Icon, Fab } from 'native-base'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { theme } from '../../../theme/theme.native'
import { validatePassword, handleComplete, TEXT_MASTERPASSWORD, TEXT_PROFILE, TEXT_START } from '../../../components/core/Setup'
import { RxAdapter, OpenpgpAdapter } from '../../../adapters/persistence'
import NavigationService from '../../../service/native/NavigationService'
import InfoAwareRouteComponent from '../InfoAwareRouteComponent'
import SetupForm from '../../../components/native/Setup/SetupForm'
import SetPassword from '../../../components/native/Setup/SetPassword'
import Finish from '../../../components/native/Setup/Finish'
import Intro from '../../../components/native/Setup/Intro'
import Profile from '../../../components/native/Profile'
import Stepper from 'react-native-js-stepper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    paddingHorizontal: 20
  },
  form: {
    width: '70%'
  },
  activeStepper: {
    backgroundColor: theme.palette.secondary.main
  },
  inactiveStepper: {
    backgroundColor: 'grey'
  }
})

class Setup extends React.Component {
  state = {
    // Stepper
    activeStep: 0,
    steps: 7,
    configuredStepper: false,
    onPressBack: null,
    onPressNext: null,
    // SetupForm
    type: '',
    additional: {},
    // Profile
    firstname: '',
    lastname: '',
    birthday: '',
    // SetPassword
    password: '',
    passwordRepitition: '',
    // Finish
    loading: false
  }

  /**
   * Returns the list of all available setup items
   */
  spinnerItems = () => [
    <Intro key={0}>{TEXT_START}</Intro>,
    <SetupForm
      key={1}
      handleChange={this.handleChange}
      type={this.state.type}
      additional={this.state.additional}
    />,
    <Intro key={2}>{TEXT_PROFILE}</Intro>,
    <Profile
      key={3}
      handleChange={this.handleChange}
      firstname={this.state.firstname}
      lastname={this.state.lastname}
      birthday={this.state.birthday}
    />,
    <Intro key={4}>{TEXT_MASTERPASSWORD}</Intro>,
    <SetPassword
      key={5}
      handleChange={this.handleChange}
      password={this.state.password}
      passwordRepitition={this.state.passwordRepitition}
    />,
    <Finish key={6} onStart={this.onStart} />
  ]

  /**
   * Handle state change
   */
  handleChange = (key, value) => this.setState({[key]: value})

  /**
   * Checks if navigation to the next step is possible
   * @returns True if access to the next step is granted
   */
  canNavigate = () => {
    // If explanation is shown, allow to navigate
    const explanationSteps = [0, 2, 4]
    if(explanationSteps.indexOf(this.state.activeStep) > -1) {
      return true
    }

    if(this.state.activeStep === 1) {
      // Setup form
      if(this.state.type === RxAdapter.description) {
        return true
      } else if(this.state.type === OpenpgpAdapter.description) {
        return this.state.additional.filePath !== undefined
      } else return false
    } else if(this.state.activeStep === 3) {
      // Profile
      return this.state.firstname !== '' && this.state.lastname !== '' && this.state.birthday !== ''
    } else if(this.state.activeStep === 5) {
      // Settings master password
      return this.state.password === this.state.passwordRepitition && validatePassword(this.state.password)
    } else return false
  }

  /**
   * Handle click on next
   */
  canNavigateNext = () => this.canNavigate() !== false && this.state.activeStep !== (this.state.steps-1)

  /**
   * Handle click on back
   */
  canNavigateBack = () => this.state.activeStep !== 0 && this.state.loading !== true

  /**
   * Starts the setup process with the collected data.
   */
  onStart = () => {
    this.setState({loading: true})
    handleComplete({
      configuration: this.props.config,
      settings: this.props.settings,
      setup: this.state,
      selection: this.state.type,
      navigateTo: () => NavigationService.navigate('Login'),
      path: this.state.additional.filePath || ''
    })
  }

  /**
   * Wraps the spinner items into View components
   * @returns array with wrapped components
   */
  wrapStepperItems = () => {
    const wrapped = []
    const items = this.spinnerItems()

    items.forEach((item, index) => {
      wrapped.push(
        <View key={index} style={styles.container}>
          {item}
        </View>
      )
    })
    return wrapped
  }

  /**
   * Patches the Function prototype to add the option to clone a function
   */
  patchFunction = () => {
    Function.prototype.clone = function() {
      var that = this
      var temp = function temporary() { return that.apply(this, arguments) }
      for(var key in this) {
        if (this.hasOwnProperty(key)) {
          temp[key] = this[key]
        }
      }
      return temp
    }
  }

  /**
   * Configures the stepper that a disabled button can be emulated
   */
  configureStepper = () => {
    if(this.state.configuredStepper === false && this.stepper !== null) {
      this.patchFunction()
      this.setState({
        onPressBack: this.stepper.onPressBack.clone(),
        onPressNext: this.stepper.onPressNext.clone(),
        configuredStepper: true
      })
    }

    if(this.stepper !== null) {
      this.stepper.onPressBack = () => {
        if(this.canNavigateBack()) {
          this.setState({activeStep: this.state.activeStep - 1})
          this.state.onPressBack()
        }
      }

      this.stepper.onPressNext = () => {
        if(this.canNavigateNext()) {
          this.setState({activeStep: this.state.activeStep + 1})
          this.state.onPressNext()
        }
      }
    }
  }

  componentWillUnmount() {
    this.setState({})
  }

  render() {
    return (
      <InfoAwareRouteComponent>
        <Stepper
          ref={ref => {
            this.stepper = ref
            this.configureStepper()
          }}
          showTopStepper={false}
          showBottomStepper={true}
          backButtonTitle="BACK"
          nextButtonTitle="NEXT"
          activeDotStyle={styles.activeStepper}
          inactiveDotStyle={styles.inactiveStepper}
          initialPage={0}
        >
          {this.wrapStepperItems()}
        </Stepper>
      </InfoAwareRouteComponent>
    )
  }
}

const mapStateToProps = ({settings: {store: settings}, config: {store: config}}) => ({settings, config})
export default connect(mapStateToProps)(Setup)
