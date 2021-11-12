import { useCallback } from 'react'
import Container from '@mui/material/Container'
import { Router } from '@reach/router'
import yaml from 'js-yaml'
import { useSelector, useDispatch } from 'react-redux'

import Empty from 'components/Empty'
import Navbar from 'components/Navbar'
import Note from 'components/Note'
import NoteList from 'components/NoteList'
import NextSteps from 'pages/NextSteps'
import Export from 'pages/Export'
import { actions, NoteType } from 'modules/Note'
import { selectNotes, selectSearch } from 'modules/Note/Note.selectors'

interface Props {
  default?: boolean
}

const Home = (props: Props) => {
  const dispatch = useDispatch()
  const notes = useSelector(selectNotes)
  const search = useSelector(selectSearch)

  const onCopyPasteYaml = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // @ts-ignore
      if (event.nativeEvent.inputType !== 'insertFromPaste') return

      const { value } = event.target
      // @ts-ignore
      const notes: Array<NoteType> = yaml.loadAll(value)
      dispatch(actions.replaceNotes({ notes }))
    },
    [dispatch]
  )

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(actions.setSearch({ search: event.target.value }))
  }

  return (
    <>
      <Navbar
        search={search}
        onSearchChange={onSearchChange}
        onResetClick={() => dispatch(actions.reset())}
      />
      <Container maxWidth="lg">
        <Router>
          {(search === '' && !notes) || (search !== '' && notes == null) ? (
            <Empty onChange={onCopyPasteYaml} text="" path="/" />
          ) : (
            <NoteList notes={notes} path="/" />
          )}
          <Note path="/:id" />
          <NextSteps notes={notes} path="/next-steps" />
          <Export path="/export" />
        </Router>
      </Container>
    </>
  )
}

export default Home
