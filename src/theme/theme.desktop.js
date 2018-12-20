import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#FAFAFA',
      main: '#F5F5F5',
      dark: '#E0E0E0',
      contrastText: '#56C7BA'
    }, secondary: {
      main: '#56C7BA',
      contrastText: '#FAFAFA',
      notice: '#777'
    }
  },
  typography: {
    useNextVariants: true,
  }
})

export { theme }
