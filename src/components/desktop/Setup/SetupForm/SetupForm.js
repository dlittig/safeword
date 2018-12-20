import React from 'react'

import { connect } from 'react-redux'
import { Setup as SetupAction } from '../../../../store/actions/Setup'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import { FormControl, Select, MenuItem, InputLabel, Grid, Button } from '@material-ui/core'

import { persistenceAdapters } from '../../../../adapters'
import Rx from './Rx'
import OpenPgp from './OpenPgp'
import { RxAdapter, OpenpgpAdapter } from '../../../../adapters/persistence'

const styles = theme => ({
  grid: {
    width: '100%',
    height: '100vh',
    backgroundColor: theme.palette.primary.main,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 5,
    right: theme.spacing.unit * 5
  },
  formItem: {
    width: '30vw'
  }
})

class SetupForm extends React.Component {
  state = {
    type: '',
    additional: {}
  }

  componentDidMount() {
    const {type, additional} = this.props
    this.setState({
      type,
      additional
    })
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    additional: PropTypes.object.isRequired
  }

  /**
   * Handles type change
   */
  handleChange = event => {
    if(event.target.value !== this.state.type) {
      this.setState({additional: {}})
      this.props.handleChange('additional', {})
    }

    this.setState({ [event.target.name]: event.target.value })
    this.props.handleChange(event.target.name, event.target.value)
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
    const { classes } = this.props

    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="persistence-select">Persist with:</InputLabel>
        <Select
          value={this.state.type}
          onChange={this.handleChange}
          className={classes.formItem}
          inputProps={{
            name: 'type',
            id: 'persistence-select',
          }}
        >
          {
            persistenceAdapters.map((element, index) => (
              <MenuItem key={index} value={element.describe()}>{element.describe()}</MenuItem>
            ))
          }
        </Select>

        {/* According to chosen setup mode display different form fields */
          (this.state.type == RxAdapter.description && (
            <Rx additional={this.state.additional} handleAdditional={this.handleAdditional} />
          ))
        }

        {/* According to chosen setup mode display different form fields */
          (this.state.type == OpenpgpAdapter.description && (
            <OpenPgp additional={this.state.additional} handleAdditional={this.handleAdditional} />
          ))
        }

      </FormControl>
    )
  }
}

export default withStyles(styles)(SetupForm)
