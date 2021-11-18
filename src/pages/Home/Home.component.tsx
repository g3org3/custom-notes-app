import { useCallback, useEffect, useContext } from 'react'
import Container from '@mui/material/Container'
import { Router } from '@reach/router'
import yaml from 'js-yaml'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'

import RootContext from 'pages/Root/Root.context'
import Empty from 'components/Empty'
import Navbar from 'components/Navbar'
import Note from 'components/Note'
import NoteList from 'components/NoteList'
import NextSteps from 'pages/NextSteps'
import Export from 'pages/Export'
import { actions, NoteType } from 'modules/Note'
import { selectNotesWithSearch, selectSearch } from 'modules/Note/Note.selectors'

interface Props {
  default?: boolean
}

const Home = (props: Props) => {
  const dispatch = useDispatch()
  const notes = useSelector(selectNotesWithSearch)
  const search = useSelector(selectSearch)
  const { keyCombo } = useContext(RootContext)

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

  const handleOpenFile = useCallback(async () => {
    const options = {
      types: [{
        description: 'Text',
        accept: { 'text/*': ['.txt', '.yaml', '.yml'] }
      }],
      multiple: false
    }

    // @ts-ignore
    const [fileHandler] = await window.showOpenFilePicker(options)
    if (fileHandler.kind !== 'file') {
      toast.error('Could not open file')
      return
    }

    const file = await fileHandler.getFile();
    const content = await file.text()

    // @ts-ignore
    const notes: Array<NoteType> = yaml.loadAll(content)
    dispatch(actions.setFileHandler({ fileHandler }))
    dispatch(actions.replaceNotes({ notes }))
    toast.success('Loaded')
  }, [dispatch])

  useEffect(() => {
    if (keyCombo === 'Meta-o' || keyCombo === 'Control-o') {
      handleOpenFile()
    }
  }, [keyCombo, handleOpenFile])

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
