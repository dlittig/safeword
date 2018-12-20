import React from 'react'
import { Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const style = theme => ({
  text: {
    lineHeight: '1.5rem',
    textAlign: 'center'
  }
})

const Intro = ({children, classes}) => (
  <Typography className={classes.text}>{children}</Typography>
)

export default withStyles(style)(Intro)
