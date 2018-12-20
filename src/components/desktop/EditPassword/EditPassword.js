import React from 'react'

import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { FormControl, Grid, TextField, InputLabel, Select, Typography, MenuItem, Input, InputAdornment, IconButton, createMuiTheme, MuiThemeProvider } from '@material-ui/core'
import { SettingsSharp as Settings, Replay, Create } from '@material-ui/icons'
import orange from '@material-ui/core/colors/orange'
import GenerateRandom from '../GenerateRandom'
import Random from '../../../modules/random'
import { matchesProfile } from '../../core/Password'

const styles = theme => ({
  formItem: {
    width: '100%',
    marginTop: 0,
    marginBottom: theme.spacing.unit * 2,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  password: {
    fontFamily : 'Courier, monospace'
  },
  groupForm: {
    marginBottom: 0
  },
  notes: {
    '& > div' : {
      paddingBottom: '2px'
    }
  },
  typography: {
    marginTop: theme.spacing.unit
  }
})

const theme = createMuiTheme({
  palette: {
    primary: orange
  },
  typography: {
    useNextVariants: true,
  }
})

class EditPassword extends React.Component {
  static propTypes = {
    model: PropTypes.object.isRequired
  }

  state = {
    name: '',
    username: '',
    password: '',
    notes: '',
    group: '',
    validTill: '',
    editGenerateOpen: false
  }

  componentDidMount() {
    const { model } = this.props
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
   * Handle change of text based properties
   */
  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value })
    this.props.handleStateChange(prop, event.target.value)
  }

  /**
   * Handle selection of group
   */
  handleSelect = event => {
    console.log('selecting group')
    this.setState({ [event.target.name]: event.target.value }, () => console.log(this.state))
    this.props.handleStateChange(event.target.name, event.target.value)
  }

  /**
   * Prevent bubbling of event
   */
  handleMouseDownGenerate = event => event.preventDefault()

  /**
   * Opens popup to generate new random password
   */
  handleClickGenerate = () => this.setState({editGenerateOpen: true})

  /**
   * Handle close of password generator popup
   */
  handleClose = prop => event => {
    this.setState({editGenerateOpen: false})

    if(prop !== 'close') {
      this.setState({password: prop}, () => this.props.handleStateChange('password', prop))
    }
  }

  /**
   * Generate a new default password when the user clicks on the refresh icon
   */
  onRefresh = async () => this.setState({password: await Random.getDefaultPassword()})

  render() {
    const { classes, groups, model } = this.props
    console.log(matchesProfile(this.state.password))

    return (
      <FormControl className={classes.formItem}>
        <GenerateRandom
          open={this.state.editGenerateOpen}
          handleClose={this.handleClose}
          descriptionText="Insert the passwort into the input field by clicking on 'Select'."
          submitText="Select"
        />
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              className={classes.formItem}
              id="name"
              label="Name"
              type="text"
              margin="normal"
              value={this.state.name}
              onChange={this.handleChange('name')}
            />

            <TextField
              className={classes.formItem}
              id="username"
              label="Username"
              type="text"
              margin="normal"
              value={this.state.username}
              onChange={this.handleChange('username')}
            />

            <FormControl className={classes.formItem}>
              <InputLabel htmlFor="password-form">Password</InputLabel>
              <Input
                className={classes.password}
                id="password-form"
                required
                type="text"
                value={this.state.password}
                onChange={this.handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Regenerate password"
                      onClick={this.onRefresh}
                      onMouseDown={this.handleMouseDownGenerate}
                    >
                      <Replay />
                    </IconButton>
                    <IconButton
                      aria-label="Configure password generation properties"
                      onClick={this.handleClickGenerate}
                      onMouseDown={this.handleMouseDownGenerate}
                    >
                      <Create />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {matchesProfile(this.state.password) && (
                <MuiThemeProvider theme={theme}>
                  <Typography className={classes.typography} variant="caption" gutterBottom>This password matches the Profile and is therefore insecure.</Typography>
                </MuiThemeProvider>
              )}
            </FormControl>

            <FormControl className={classes.formItem}>
              <TextField
                id="validTill"
                label="Valid till"
                type="date"
                helperText="Passwords will be marked yellow when the password has reached the allowed date"
                value={this.state.validTill}
                onChange={this.handleChange('validTill')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl className={classNames(classes.formItem, classes.groupForm)}>
              <InputLabel shrink htmlFor="group-label-placeholder">
                Group
              </InputLabel>
              <Select
                value={this.state.group}
                onChange={this.handleSelect}
                input={<Input name="group" id="group-label-placeholder" />}
                displayEmpty
                className={classNames(classes.selectEmpty, classes.formItem)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {groups.map((group, key) => (
                  <MenuItem value={group.name} key={key}>{group.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              className={classNames(classes.formItem, classes.notes)}
              id="note"
              label="Notes"
              type="text"
              margin="normal"
              multiline
              rows="8"
              value={this.state.notes}
              onChange={this.handleChange('notes')}
            />
          </Grid>
        </Grid>
      </FormControl>
    )
  }
}

export default withStyles(styles)(EditPassword)
