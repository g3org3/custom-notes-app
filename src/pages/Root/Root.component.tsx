import React, { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
// @ts-ignore
import { Router } from '@reach/router'

import { theme, darkTheme } from 'style'
import RootContext from './Root.context'
import Home from 'pages/Home'

import { Container } from './Root.style'

const appVersion = process.env['REACT_APP_VERSION'] || '-1'

const Root = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [notesYaml, setNotesYaml] = useState<string | null>(null)

  return (
    <RootContext.Provider
      value={{
        appVersion,
        isDarkTheme,
        notesYaml,
        setIsDarkTheme,
        setNotesYaml,
      }}
    >
      <ThemeProvider theme={isDarkTheme ? darkTheme : theme}>
        <Container isDarkTheme={isDarkTheme}>
          <Router>
            <Home default />
          </Router>
        </Container>
      </ThemeProvider>
    </RootContext.Provider>
  )
}

export default Root
