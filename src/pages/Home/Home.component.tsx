import React, { useContext } from 'react'
import Container from '@mui/material/Container'
/* @ts-ignore */
import { Router } from '@reach/router'

import Navbar from 'components/Navbar'
import Empty from 'components/Empty'
import NoteList from 'components/NoteList'
import NextSteps from 'pages/NextSteps'

import RootContext from 'pages/Root/Root.context'
import HomeContext from './Home.context'
import { useHome } from './Home.hooks'

interface Props {
  default?: boolean
}

const Home = (props: Props) => {
  const { notesYaml, setNotesYaml } = useContext(RootContext)

  const {
    filteredNotes,
    notes,
    onCopyPasteYaml,
    onSearchChange,
    placeHolderText,
    resetAppState,
    search,
  } = useHome(notesYaml, setNotesYaml)

  return (
    <HomeContext.Provider value={{ globalOpen: false }}>
      <Navbar
        search={search}
        onSearchChange={onSearchChange}
        onHomeClick={resetAppState}
        /*@ts-ignore*/
      />
      <Container maxWidth="lg">
        <Router>
          {(search === '' && !notes) || (search !== '' && notes == null) ? (
            <Empty onChange={onCopyPasteYaml} text={placeHolderText} path="/" />
          ) : (
            <NoteList notes={filteredNotes} path="/" />
          )}
          <NextSteps notes={notes} path="/next-steps" />
        </Router>
      </Container>
    </HomeContext.Provider>
  )
}

export default Home
