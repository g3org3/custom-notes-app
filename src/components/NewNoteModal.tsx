import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, Textarea } from '@chakra-ui/react'
import { useNavigate } from '@reach/router'
import yaml from 'js-yaml'
import { DateTime } from 'luxon'
import { FC, useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import { actions, NoteDBType } from 'modules/Note'
import { inboundMapper } from 'services/notes'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const initialNote = `subject: meeting
emoji: memo
people: []
tags: []
notes: |-
  # hello`

const NewNoteModal: FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const textRef = useRef<HTMLTextAreaElement>()

  const onKeyDown = (e: any) => {
    if (e.code !== 'Tab') return

    const index: number | null = e.target?.selectionStart
    if (index === undefined || index === null || !textRef.current) return

    let front = e.target.value.substring(0, index)
    let back = e.target.value.substring(index, e.target.value.length)

    textRef.current.value = front + '  ' + back
    textRef.current.selectionStart = index + 2
    textRef.current.selectionEnd = index + 2
    textRef.current.focus()
  }

  const saveNote = () => {
    if (!textRef.current) return
    const rawNote = textRef.current.value
    const ynote = yaml.load(rawNote)
    // @ts-ignore
    let note: NoteDBType = {
      id: uuidv4(),
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

  useHotkeys('ctrl+return', saveNote, { enableOnTags: ['TEXTAREA'] })
  useHotkeys('command+return', saveNote, { enableOnTags: ['TEXTAREA'] })

  useEffect(() => {
    if (!textRef.current) return
    setTimeout(() => {
      if (!textRef.current) return
      textRef.current.selectionStart = 2
      textRef.current.selectionEnd = 2
    }, 1000)
  }, [textRef])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay zIndex="2" />
      <ModalContent>
        <ModalHeader>New Note</ModalHeader>
        <ModalBody display="flex" flexDir="column" gap={2}>
          <Textarea
            onKeyDown={onKeyDown}
            height="calc(100vh - 100px)"
            border="0"
            _focus={{ boxShadow: 'none' }}
            fontFamily="monospace"
            fontSize="32px"
            defaultValue={initialNote}
            placeholder="notes in markdown"
            // @ts-ignore
            ref={textRef}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NewNoteModal
