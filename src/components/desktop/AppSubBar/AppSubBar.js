import React from 'react'

import { Grid, Typography, Select, MenuItem } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { importExportAdapters } from '../../../adapters'

const style = theme => ({
  background: {
    backgroundColor: '#E0E0E0'
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  container: {
    marginLeft: '-24px',
    //marginRight: '-24px',
    marginTop: '-24px',
    marginBottom: '12px',
    display: 'inline-flex',
    width: 'calc(100vw - 48px)',
    alignItems: 'baseline',
    padding: '0 24px 12px 24px'
  },
  text: {
    flex: 1,
    fontSize: '1rem'
  }
})

class AppSubBar extends React.Component {
  state = {
    mode: 'CSV'
  }

  handleChange = event => this.setState({ [event.target.name]: event.target.value })

  render() {
    const { classes } = this.props
    console.log(importExportAdapters)

    return (
      <Grid className={classNames([classes.background, classes.container])}>
        <Typography className={classes.text}>Mode</Typography>
        <Select
          value={this.state.mode}
          onChange={this.handleChange}
          displayEmpty
          name="mode"
          className={classes.selectEmpty}
        >
          { importExportAdapters.map(element => (
            <MenuItem value={element.describe()}>{element.describe()}</MenuItem>
          ))}
        </Select>
      </Grid>
    )
  }
}

export default withStyles(style)(AppSubBar)
