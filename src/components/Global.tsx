import { useColorMode, useDisclosure, useToast } from '@chakra-ui/react'
import { useNavigate } from '@reach/router'
import yaml from 'js-yaml'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'

import NewNoteModal from 'components/NewNoteModal'
import SearchModal from 'components/SearchModal'
import { dbOnValue, dbSet } from 'config/firebase'
import { useSave } from 'hooks/note'
import { useAuth } from 'lib/auth'
import { getFingerPrint } from 'lib/fingerprint'
import { actions } from 'modules/Note'
import { selectFileHandler, selectNotes } from 'modules/Note/Note.selectors'
import { inboundMapper } from 'services/notes'

interface Props {
  onClickAuth: () => void
  isOpenNewNote: boolean
  onOpenNewNote: () => void
  onCloseNewNote: () => void
}

const Global: React.FC<Props> = ({ onClickAuth, isOpenNewNote, onCloseNewNote, onOpenNewNote }) => {
  const toast = useToast()
  const { saveNotesToFile } = useSave()
  const { currentUser } = useAuth()
  const fileHandler = useSelector(selectFileHandler)
  const notes = useSelector(selectNotes)
  const { fingerprintId } = getFingerPrint()

  const { isOpen, onOpen, onClose } = useDisclosure()

  useHotkeys(
    '/',
    (e) => {
      e.preventDefault()
      onOpen()
    },
    [onOpen]
  )
  useHotkeys(
    'command+k',
    (e) => {
      e.preventDefault()
      onOpen()
    },
    [onOpen]
  )
  useHotkeys(
    'ctrl+k',
    (e) => {
      e.preventDefault()
      onOpen()
    },
    [onOpen]
  )

  useEffect(() => {
    if (!currentUser) return
    dbSet(`auth/${currentUser.uid}/${fingerprintId}`, 'connected', true)
    dbSet(`auth/${currentUser.uid}/${fingerprintId}`, 'updatedAt', DateTime.now().toISO())
    // eslint-disable-next-line
  }, [currentUser])

  useHotkeys(
    'n',
    (e) => {
      e.preventDefault()
      onOpenNewNote()
    },
    [onOpenNewNote]
  )

  useEffect(() => {
    if (!currentUser) return

    dbOnValue(`auth/${currentUser.uid}/${fingerprintId}/forceLogout`, (snapshot) => {
      const val = snapshot.val()
      if (val) {
        onClickAuth()
      }
    })
    // eslint-disable-next-line
  }, [currentUser])

  useHotkeys('command+s', saveNotesToFile, [toast, notes, fileHandler, currentUser])
  useHotkeys('ctrl+s', saveNotesToFile, [toast, notes, fileHandler, currentUser])
  const { toggleColorMode } = useColorMode()
  useHotkeys('d', () => toggleColorMode(), [toggleColorMode])

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const saveNote = (rawNote: string) => {
    const ynote = yaml.load(rawNote)
    // @ts-ignore
    let note: NoteDBType = {
      id: v4(),
      emoji: 'memo',
      date: DateTime.now(),
    }
    if (typeof ynote === 'string') {
      note.notes = ynote
    } else {
      note = { ...inboundMapper(ynote), ...note }
    }
    dispatch(actions.add({ note }))
    onClose()
    navigate('/notes')
  }

  return (
    <>
      <NewNoteModal onSave={saveNote} isOpen={isOpenNewNote} onClose={onCloseNewNote} />
      <SearchModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default Global
