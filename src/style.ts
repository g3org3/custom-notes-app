import { createTheme } from '@mui/material/styles'
import { indigo, orange } from '@mui/material/colors'

export const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
    secondary: {
      main: orange[500],
    },
  },
})
