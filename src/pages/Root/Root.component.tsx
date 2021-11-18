import { useState, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { Router } from '@reach/router'
import toast, { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'

import { theme, darkTheme } from 'style'
import RootContext from './Root.context'
import Home from 'pages/Home'
import { selectFileHandler, selectNotes } from 'modules/Note/Note.selectors'
import { notesToYaml } from 'modules/Note/Note.service'

import { Container } from './Root.style'

const appVersion = process.env['REACT_APP_VERSION'] || '-1'

const Root = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [keyCombo, setKeyCombo] = useState('')
  const fileHandler = useSelector(selectFileHandler)
  const notes = useSelector(selectNotes)

  useEffect(() => {
    let keys: Array<string> = []
    document.onkeydown = async (event) => {
      if (keys.length === 2) {
        keys = keys.slice(1)
      }
      keys.push(event.key)
      const combo = keys.join('-')
      setKeyCombo(combo)
      const userWantsToSave = (event.ctrlKey && event.key === 's') || combo === 'Meta-s'
      if (userWantsToSave) {
        event.preventDefault()
        try {
          if (!notes) throw Error('There are 0 notes to export')

          // @ts-ignore
          const writableStream = await fileHandler.createWritable();
          await writableStream.write(notesToYaml(notes));
          writableStream.close();
          toast.success('Saved!')
        } catch (e) {
          toast.error('Uh oh, something went wrong.')
        }
      }
    }
  }, [fileHandler, notes])


  return (
    <RootContext.Provider
      value={{
        appVersion,
        isDarkTheme,
        setIsDarkTheme,
        keyCombo
      }}
    >
      <ThemeProvider theme={isDarkTheme ? darkTheme : theme}>
        <Container isDarkTheme={isDarkTheme}>
          <Router>
            <Home default />
          </Router>
          <Toaster position="bottom-right" reverseOrder={true} />
        </Container>
      </ThemeProvider>
    </RootContext.Provider>
  )
}

export default Root
