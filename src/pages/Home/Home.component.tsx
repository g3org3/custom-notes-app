import { useCallback } from 'react'
import Container from '@mui/material/Container'
import { Router } from '@reach/router'
import yaml from 'js-yaml'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'

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
      toast.success('Loaded')
    },
    [dispatch]
  )

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(actions.setSearch({ search: event.target.value }))
  }

  const onResetClick = () => {
    dispatch(actions.reset())
    toast.success('Everything was removed')
  }

  const handleOpenFile = async () => {
    const options = {
      types: [{
        description: 'Text',
        accept: { 'text/*': ['.txt', '.yaml', '.yml'] }
      }],
      multiple: false
    }

    // @ts-ignore
    const [fileHandle] = await window.showOpenFilePicker(options)
    if (fileHandle.kind !== 'file') {
      toast.error('Could not open file')
      return
    }

    const file = await fileHandle.getFile();
    const content = await file.text()

    // @ts-ignore
    const notes: Array<NoteType> = yaml.loadAll(content)
    dispatch(actions.replaceNotes({ notes }))
    toast.success('Loaded')
  }

  return (
    <>
      <Navbar
        search={search}
        onSearchChange={onSearchChange}
        onResetClick={onResetClick}
      />
      <Container maxWidth="lg">
        <Router>
          {(search === '' && !notes) || (search !== '' && notes == null) ? (
            <Empty onChange={onCopyPasteYaml} onOpenFileClick={handleOpenFile} text="" path="/" />
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
