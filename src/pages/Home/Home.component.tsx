import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'

// @ts-ignore
import yaml from 'js-yaml'

import Navbar from 'components/Navbar'
import type { NoteType } from 'components/Note'
import { searchNotes } from 'components/Note/Note.service'
import Empty from 'components/Empty'
import NoteList from 'components/NoteList'

import HomeContext from './Home.context'

const Home = () => {
  const [notes, setNotes] = useState<Array<NoteType> | null>(null)
  const [text, setText] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [filteredNotes, setFN] = useState<Array<NoteType>>([])

  const onSearchChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setSearch(value)

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
    setNotes(null)
    setFN([])
  }

  useEffect(() => {
    setFN(searchNotes(search, notes))
  }, [search, notes])

  return (
    <HomeContext.Provider value={{ globalOpen: false }}>
      <Navbar
        search={search}
        onSearchChange={onSearchChange}
        resetState={resetState}
        /*@ts-ignore*/
      />
      <Container maxWidth="md">
        {(search === '' && !notes) || (search !== '' && notes == null) ? (
          <Empty onChange={handleChange} text={text} />
        ) : (
          <NoteList notes={filteredNotes} />
        )}
      </Container>
    </HomeContext.Provider>
  )
}

export default Home
