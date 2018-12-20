import React from 'react'

import Routes from './routes/desktop'
import Snackbar from './components/desktop/Snackbar'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { theme } from './theme/theme.desktop'

const App = () => (
  <MuiThemeProvider theme={theme}>
    <Routes />
    <Snackbar />
  </MuiThemeProvider>
)
export default App
