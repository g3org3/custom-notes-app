import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
// @ts-ignore
import yaml from 'js-yaml'

import Navbar from '../../components/Navbar'
import Note from '../../components/Note'
import type { NoteType } from '../../components/Note'
import { searchNotes } from '../../components/Note/Note.service'
import HomeContext from './Home.context'

const Home = () => {
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

  useEffect(() => {
    setFN(searchNotes(search, notes))
  }, [search, notes])

  return (
    <HomeContext.Provider value={{ globalOpen }}>
      <Navbar
        search={search}
        onSearchChange={onSearchChange}
        areNotesOpen={globalOpen}
        /*@ts-ignore*/
        onGlobalOpenClick={onGlobalOpenClick}
      />
      <Container maxWidth="md" sx={{ marginTop: '80px' }}>
        {fileteredNotes.length === 0 && search !== '' ? (
          <Typography>No notes found</Typography>
        ) : null}
        {fileteredNotes.length === 0 && search === '' ? (
          <TextField
            id="outlined-multiline-flexible"
            multiline
            rows={20}
            value={text}
            onChange={handleChange}
          />
        ) : (
          fileteredNotes.map((n) => <Note {...n} />)
        )}
      </Container>
    </HomeContext.Provider>
  )
}

export default Home
