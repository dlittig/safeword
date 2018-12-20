import React from 'react'

import { Setup as SetupAction } from '../../../../../store/actions/Setup'
import { Button, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { store } from '../../../../../store/store.desktop'
import os from 'os'

const { dialog } = require('electron').remote

const styles = theme => ({
  formControl: {
    margin: `${theme.spacing.unit * 3}px 0`,
    width: '100%'
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  button: {
    width: '100%',
    marginTop: '10px'
  }
})

class OpenPgp extends React.Component {
  state = {
    filePath: ''
  }

  componentDidMount() {
    if(this.props.additional.mode !== undefined) this.setState({mode: this.props.additional.mode})
    if(this.props.additional.filePath !== undefined) this.setState({filePath: this.props.additional.filePath})
  }

  /**
   * Opens filepicker to select destination directory for key files
   */
  onOpenFilepicker = () => () => {
    dialog.showOpenDialog({
      defaultPath: os.homedir(),
      properties: [
        'openDirectory',
        'showHiddenFiles'
      ]
    }, filePaths => {
      if(filePaths !== undefined) {
        if(filePaths.length === 1) {
          this.props.handleAdditional('filePath', filePaths[0])
        } else {
          store.dispatch(SetupAction.error('There is something wrong with this directory.'))
        }
      }
    })
  }

  render() {
    const { classes } = this.props

    return (
      <FormControl component="fieldset" required className={classes.formControl}>
        <FormLabel component="legend">Key files directory</FormLabel>
        <Button variant="contained" className={classes.button} onClick={this.onOpenFilepicker()}>
          Select directory
        </Button>
      </FormControl>
    )
  }
}

export default withStyles(styles)(OpenPgp)
