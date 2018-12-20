import React from 'react'

import { connect } from 'react-redux'
import { Setup as SetupAction } from '../../../store/actions/Setup'
import SetupForm from '../../../components/desktop/Setup/SetupForm'
import Intro from '../../../components/desktop/Setup/Intro'
import Finish from '../../../components/desktop/Setup/Finish'
import SetPassword from '../../../components/desktop/Setup/SetPassword'
import Profile from '../../../components/desktop/Profile'
import AppBar from '../../../components/desktop/AppBar/AppBar'
import { Grid, Button, MobileStepper } from '@material-ui/core'
import { ArrowForward, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import { validatePassword, handleComplete, TEXT_MASTERPASSWORD, TEXT_PROFILE, TEXT_START } from '../../../components/core/Setup'
import { withStyles } from '@material-ui/core/styles'
import { RxAdapter, OpenpgpAdapter } from '../../../adapters/persistence'

const styles = theme => ({
  grid: {
    width: '100%',
    height: '100vh',
    paddingLeft: '20vw',
    paddingRight: '20vw',
    backgroundColor: theme.palette.primary.main
  },
  button: {
    color: theme.palette.secondary.main,
  },
  dotActive: {
    backgroundColor: theme.palette.secondary.main,
  },
  stepper: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 'calc(100% - 16px)',
    borderTop: '1px solid lightgrey'
  }
})

class Setup extends React.Component {
  state = {
    // Stepper
    activeStep: 0,
    steps: 7,
    configuredSteps: 0,
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

  changeLocation = path => this.props.history.push(path)

  /**
   * Handle click on next
   */
  handleNext = () => this.setState({activeStep: this.state.activeStep + 1})

  /**
   * Handle click on back
   */
  handleBack = () => this.setState({activeStep: this.state.activeStep - 1})

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
   * Starts the setup process with the collected data.
   */
  onStart = () => {
    this.setState({loading: true})
    handleComplete({
      configuration: this.props.config,
      settings: this.props.settings,
      setup: this.state,
      selection: this.state.type,
      navigateTo: () => this.changeLocation('/login'),
      path: this.state.additional.filePath || ''
    })
  }

  componentWillUnmount() {
    this.setState({})
  }

  render() {
    const {classes, theme} = this.props

    return (
      <AppBar fullScreen backButton>
        <Grid
          container
          className={classes.grid}
          alignItems="center"
          direction="row"
          justify="center"
        >
          {this.spinnerItems()[this.state.activeStep]}
        </Grid>
        <MobileStepper
          variant="dots"
          steps={this.state.steps}
          position="static"
          activeStep={this.state.activeStep}
          classes={{
            root: classes.stepper,
            dotActive: classes.dotActive
          }}
          nextButton={
            <Button size="small" className={classes.button} onClick={this.handleNext} disabled={this.state.activeStep === (this.state.steps-1) || !this.canNavigate()}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" className={classes.button} onClick={this.handleBack} disabled={this.state.activeStep === 0 || this.state.loading === true}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
      </AppBar>
    )
  }
}

const mapStateToProps = ({config: {store: config}, settings: {store: settings}}) => ({config, settings})

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(Setup))
