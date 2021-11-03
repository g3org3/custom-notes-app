import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import yaml from 'js-yaml'

import Navbar from '../../components/Navbar'
import Note from '../../components/Note'
import type { NoteType } from '../../components/Note'
import HomeContext from './Home.context'

const Home = () => {
  const [notes, setNotes] = useState([])
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [fileteredNotes, setFN] = useState([])
  const [globalOpen, setGO] = useState(false)

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }
  const onGlobalOpenClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGO(!globalOpen)
  }

  const handleChange = (e) => {
    const { inputType } = e.nativeEvent
    const { value } = e.target
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
    if (search === '') {
      setFN(notes)
      return
    }
    const createFTS = (search = '') => (line = '') => {
      const lline = line.toLowerCase()
      const ssearch = search.toLowerCase()
      return lline.indexOf(ssearch) !== -1
    }
    const fts = createFTS(search)

    const isInPeople = (note: NoteType) => note.people && note.people.filter(fts).length > 0
    const isInSubject = (note: NoteType) => note.subject && fts(note.subject)
    const isInNotes = (note: NoteType) => note.notes && fts(note.notes)
    const isInTags = (note: NoteType) => note.tags && note.tags.filter(fts).length > 0

    const nf = notes.filter(
      (note) => isInPeople(note) || isInSubject(note) || isInNotes(note) || isInTags(note)
    )
    setFN(nf)
  }, [search, notes])

  return (
    <HomeContext.Provider value={{ globalOpen }}>
      <Navbar
        search={search}
        onSearchChange={onSearchChange}
        areNotesOpen={globalOpen}
        onGlobalOpenClick={onGlobalOpenClick}
      />
      <Container maxWidth="md" sx={{ marginTop: '80px' }}>
        {fileteredNotes.length === 0 && search !== '' ? (
          <Typography>No notes found</Typography>
        ) : null}
        {fileteredNotes.length === 0 && search === '' ? (
          <TextField
            id="outlined-multiline-flexible"
            label="Multiline"
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
