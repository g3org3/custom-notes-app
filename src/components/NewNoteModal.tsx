import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
  ModalCloseButton,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import { FC, useEffect, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

interface Props {
  title?: string | null
  isOpen: boolean
  onClose: () => void
  onSave: (rawValue: string) => void
  defaultValue?: string
}

const initialNote = `subject: meeting
emoji: memo
people: []
tags: []
notes: |-
  # hello`

const NewNoteModal: FC<Props> = ({ isOpen, title, onClose, onSave, defaultValue }) => {
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
    onSave(rawNote)
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
        <ModalHeader>{title || 'New Note'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column" gap={2}>
          <Textarea
            onKeyDown={onKeyDown}
            height="calc(100vh - 150px)"
            border="0"
            _focus={{ boxShadow: 'none' }}
            fontFamily="monospace"
            fontSize="20px"
            defaultValue={defaultValue || initialNote}
            placeholder="notes in markdown"
            // @ts-ignore
            ref={textRef}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={saveNote} variant="ghost">
            {title ? 'Update' : 'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default NewNoteModal
