import { FC, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Input,
  ModalHeader,
  ModalBody,
  Textarea,
  Button,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { actions, NoteDBType } from 'modules/Note'
import { useDispatch } from 'react-redux'
import { useNavigate } from '@reach/router'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const NewNoteModal: FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [state, setState] = useState({
    emoji: '',
    subject: '',
    people: '',
    tags: '',
    notes: '',
    next_steps: '',
    doubts: '',
  })

  // @ts-ignore
  const handleOnChange = (field: string) => (e) => {
    setState({
      ...state,
      // @ts-ignore
      [field]: e.target.value,
    })
  }

  const reset = () => {
    setState({
      emoji: '',
      subject: '',
      people: '',
      tags: '',
      notes: '',
      next_steps: '',
      doubts: '',
    })
  }

  const handleForm = () => {
    const note: NoteDBType = {
      id: uuidv4(),
      date: DateTime.now(),
      people:
        state.people === ''
          ? null
          : state.people.split(',').map((x) => x.trim()),
      subject: state.subject === '' ? null : state.subject,
      notes: state.notes === '' ? null : state.notes,
      next_steps:
        state.next_steps === ''
          ? null
          : state.next_steps.split('\n').map((x) => x.trim()),
      emoji: state.emoji === '' ? null : state.emoji,
      tags:
        state.tags === '' ? null : state.tags.split(',').map((x) => x.trim()),
      doubts:
        state.doubts === ''
          ? null
          : state.doubts.split('\n').map((x) => x.trim()),
    }
    dispatch(actions.add({ note }))
    reset()
    onClose()
    navigate('/notes')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Note</ModalHeader>
        <ModalBody display="flex" flexDir="column" gap={2}>
          <Input
            placeholder="emoji"
            onChange={handleOnChange('emoji')}
            value={state.emoji}
          />
          <Input
            placeholder="subject"
            onChange={handleOnChange('subject')}
            value={state.subject}
          />
          <Input
            placeholder="people separated by ,"
            onChange={handleOnChange('people')}
            value={state.people}
          />
          <Input
            placeholder="tags separated by ,"
            onChange={handleOnChange('tags')}
            value={state.tags}
          />
          <Textarea
            placeholder="notes in markdown"
            onChange={handleOnChange('notes')}
            value={state.notes}
          />
          <Textarea
            placeholder="next_steps"
            onChange={handleOnChange('next_steps')}
            value={state.next_steps}
          />
          <Textarea
            placeholder="doubts"
            onChange={handleOnChange('doubts')}
            value={state.doubts}
          />
          <Button onClick={handleForm}>Create</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default NewNoteModal
