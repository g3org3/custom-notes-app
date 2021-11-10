import React, { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'

import { theme, darkTheme } from 'style'
import RootContext from './Root.context'
import Home from 'pages/Home'

import { Container } from './Root.style'

const appVersion = process.env['REACT_APP_VERSION'] || '-1'

const Root = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  return (
    <RootContext.Provider value={{ appVersion, isDarkTheme, setIsDarkTheme }}>
      <ThemeProvider theme={isDarkTheme ? darkTheme : theme}>
        <Container isDarkTheme={isDarkTheme}>
          <Home />
        </Container>
      </ThemeProvider>
    </RootContext.Provider>
  )
}

export default Root