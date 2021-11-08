import React, { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'

import { theme, darkTheme } from 'style'
import RootContext from './Root.context'
import Home from 'pages/Home'

const appVersion = process.env['REACT_APP_VERSION'] || '-1'

const Root = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  return (
    <RootContext.Provider value={{ appVersion, isDarkTheme, setIsDarkTheme }}>
      <ThemeProvider theme={isDarkTheme ? darkTheme : theme}>
        <div
          style={{
            padding: '0',
            margin: 0,
            paddingTop: '75px',
            background: isDarkTheme ? '#333' : '#f8f8f8',
            height: '100vh',
            width: '100vw',
            boxSizing: 'border-box',
          }}
        >
          <Home />
        </div>
      </ThemeProvider>
    </RootContext.Provider>
  )
}

export default Root
