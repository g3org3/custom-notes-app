import { useDisclosure, useToast } from '@chakra-ui/react'
import { useNavigate } from '@reach/router'
import yaml from 'js-yaml'
import { FC, useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch, useSelector } from 'react-redux'

import NewNoteModal from 'components/NewNoteModal'
import NoteView from 'components/NoteView'
import { actions, NoteDBType, selectors } from 'modules/Note'
import { readFileContent } from 'services/file'
import { inboundMapper, notesToYaml } from 'services/notes'

interface Props {
  default?: boolean
  path?: string
  noteId?: string
}

const NoteId: FC<Props> = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const isThereAnyNotes = useSelector(selectors.selectIsThereAnyNotes)
  const note = useSelector(selectors.selectNoteById(props.noteId))
  const noteYaml = notesToYaml(note)
  const fileHandler = useSelector(selectors.selectFileHandler)
  const { onOpen, isOpen, onClose } = useDisclosure()

  useHotkeys('e', (e) => {
    e.preventDefault()
    onOpen()
  })
  useHotkeys('esc', () => void navigate('/notes'), [navigate])
  useHotkeys(
    'r',
    () => {
      readFileContent(fileHandler)
        .then((content) => {
          // @ts-ignore
          const result = yaml.loadAll(content)
          if (result instanceof Array) {
            const notes: Array<NoteDBType> = result.flat().map(inboundMapper)
            dispatch(actions.replaceNotes({ notes }))
            toast({ title: 'notes updated', status: 'success' })
          } else {
            toast({
              title: 'Parse Error',
              description: 'Could not parse the given file',
              status: 'error',
            })
          }
        })
        .catch((err) => {
          toast({
            title: 'Parse Error',
            description: err.message,
            status: 'error',
          })
        })
    },
    [dispatch, fileHandler]
  )

  const onClickNextStep = useCallback(
    (index: number, value: string) => {
      if (!note) return

      dispatch(
        actions.toggleNextStep({
          noteId: note.id,
          nextStepIndex: index,
        })
      )
    },
    [dispatch, note]
  )

  if (!isThereAnyNotes || !note) {
    navigate('/')

    return null
  }

  const onClickDoubt = (index: number, value: string) => {
    dispatch(
      actions.toggleDoubt({
        noteId: note.id,
        doubtIndex: index,
      })
    )
  }

  const saveNote = (rawNote: string) => {
    const ynote = yaml.load(rawNote)
    // @ts-ignore
    let _note: NoteDBType = {
      ...note,
    }
    if (typeof ynote === 'string') {
      _note.notes = ynote
    } else {
      _note = inboundMapper(ynote)
    }
    dispatch(actions.replaceNote(_note))
    onClose()
  }

  return (
    <>
      <NewNoteModal onSave={saveNote} isOpen={isOpen} onClose={onClose} defaultValue={noteYaml} />
      <NoteView note={note} onClickDoubt={onClickDoubt} onClickNextStep={onClickNextStep} />
    </>
  )
}

export default NoteId
