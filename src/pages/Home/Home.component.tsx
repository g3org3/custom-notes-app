import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'

// @ts-ignore
import yaml from 'js-yaml'

import Navbar from 'components/Navbar'
import Note from 'components/Note'
import type { NoteType } from 'components/Note'
import { searchNotes } from 'components/Note/Note.service'
import HomeContext from './Home.context'
import Pre from 'components/Pre'
import { yamlExample } from './yaml.example'

interface Props {}

const appVersion = process.env['REACT_APP_VERSION'] || -1

const Home = (props: Props) => {
  const [notes, setNotes] = useState<Array<NoteType>>([])
  const [text, setText] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [fileteredNotes, setFN] = useState<Array<NoteType>>([])
  const [globalOpen, setGO] = useState<boolean>(false)

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }
  const onGlobalOpenClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGO(!globalOpen)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const { inputType } = event.nativeEvent
    const { value } = event.target
    setText(value)
    if (inputType === 'insertFromPaste') {
      setText('loading...')
      setTimeout(() => {
        setText('done')
        const notes = yaml.loadAll(value)
        setNotes(notes.reverse())
      }, 1000)
    }
  }

  const resetState = () => {
    setText('')
    setNotes([])
    setFN([])
  }

  useEffect(() => {
    setFN(searchNotes(search, notes))
  }, [search, notes])

  return (
    <HomeContext.Provider value={{ globalOpen }}>
      <Navbar
        search={search}
        onSearchChange={onSearchChange}
        resetState={resetState}
        /*@ts-ignore*/
        onGlobalOpenClick={onGlobalOpenClick}
      />

      <Container maxWidth="md">
        {fileteredNotes.length === 0 && search !== '' ? (
          <Typography>No notes found</Typography>
        ) : null}
        {fileteredNotes.length === 0 && search === '' ? (
          <Paper sx={{ padding: '20px 15px' }}>
            <Typography>
              Paste your notes below. (expecting them to be in yaml)
            </Typography>
            <TextField
              multiline
              placeholder={`paste your YAML notes version: ${appVersion}`}
              rows={2}
              value={text}
              sx={{ width: '100%', margin: '20px 0' }}
              onChange={handleChange}
            />
            <Pre>{yamlExample}</Pre>
          </Paper>
        ) : (
          fileteredNotes.map((n) => <Note {...n} />)
        )}
      </Container>
    </HomeContext.Provider>
  )
}

export default Home
