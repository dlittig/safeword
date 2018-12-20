import React from 'react'

import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { FormControl, Grid, TextField } from '@material-ui/core'
import SettingsStore from '../../../settings'
import PropTypes from 'prop-types'

const style = theme => ({
  formItem: {
    width: '100%',
    marginTop: 0,
    marginBottom: theme.spacing.unit * 2,
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

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value })
    this.props.handleChange(prop, event.target.value)
  }

  render() {
    const {classes} = this.props
    return (
      <FormControl className={classes.formItem}>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              className={classes.formItem}
              id="firstname"
              label="Firstname"
              type="text"
              margin="normal"
              value={this.state.firstname}
              onChange={this.handleChange('firstname')}
            />

            <TextField
              required
              className={classes.formItem}
              id="name"
              label="Lastname"
              type="text"
              margin="normal"
              value={this.state.lastname}
              onChange={this.handleChange('lastname')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              className={classes.formItem}
              id="birthday"
              label="Birthday"
              type="date"
              margin="normal"
              value={this.state.birthday}
              onChange={this.handleChange('birthday')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </FormControl>
    )
  }
}

const mapStateToProps = ({settings: {readOnly: settings}}) => ({settings})

export default connect(mapStateToProps)(withStyles(style)(Profile))
