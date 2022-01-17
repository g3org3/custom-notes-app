import {
  Box,
  Link,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  useColorModeValue,
} from '@chakra-ui/react'
import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link as ReachLink } from '@reach/router'
import { useHotkeys } from 'react-hotkeys-hook'
import { FiSearch, FiX } from 'react-icons/fi'

import {
  selectIsThereAnyNotes,
  selectNotesWithSearch,
  selectSearch,
} from 'modules/Note/Note.selectors'
import { dateToPretty } from 'services/date'
import { completedList, countDone } from 'services/notes'
import ShowIf from 'components/Show'
import { actions } from 'modules/Note'

interface Props {
  default?: boolean
  path?: string
}

const Home: FC<Props> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const dispatch = useDispatch()
  const isThereAnyNotes = useSelector(selectIsThereAnyNotes)
  const completedBackround = useColorModeValue('green.100', 'green.900')
  const completedColor = useColorModeValue('green.500', 'green.400')
  const search = useSelector(selectSearch)
  const notes = useSelector(selectNotesWithSearch)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useHotkeys('/', (e) => {
    e.preventDefault()
    void onOpen()
  })

  useEffect(() => {
    if (!isThereAnyNotes) {
      toast({ title: 'You do not have any notes', status: 'warning' })
      navigate('/')
    }
  }, [isThereAnyNotes, toast, navigate])

  const handleSearchChange = (event: React.FormEvent<HTMLInputElement>) => {
    // @ts-ignore
    dispatch(actions.setSearch({ search: event.target.value }))
  }
  const removeSearch = () => {
    dispatch(actions.setSearch({ search: null }))
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <InputGroup>
            <InputLeftElement>
              <FiSearch />
            </InputLeftElement>
            <Input
              onChange={handleSearchChange}
              placeholder="search"
              value={search || ''}
            />
            <InputRightAddon cursor="pointer" onClick={removeSearch}>
              <FiX />
            </InputRightAddon>
          </InputGroup>
        </ModalContent>
      </Modal>
      <Box width="90vw">
        <Heading as="h2">
          <span>📓 </span> Notes
        </Heading>

        <ShowIf value={!!notes}>
          <Table
            variant="simple"
            size="sm"
            width="90vw"
            display={{ base: 'block', md: 'none' }}
          >
            <Thead>
              <Tr>
                <Th>Subject</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notes?.map((note) => (
                <Tr key={note.id}>
                  <Td>
                    <Link as={ReachLink} to={`/notes/${note.id}`}>
                      <Text>{note.subject}</Text>
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Table
            variant="simple"
            width="90vw"
            display={{ base: 'none', md: 'block' }}
          >
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Subject</Th>
                <Th>Next Steps</Th>
                <Th>Doubts</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notes?.map((note) => (
                <Tr key={note.id}>
                  <Td>{dateToPretty(note.date)}</Td>
                  <Td>
                    <Link as={ReachLink} to={`/notes/${note.id}`}>
                      <Text>{note.subject}</Text>
                    </Link>
                  </Td>
                  <Td>
                    <ShowIf value={!completedList(note.next_steps)}>
                      {countDone(note.next_steps)}
                    </ShowIf>
                    <ShowIf value={completedList(note.next_steps)}>
                      <Box
                        display="inline-block"
                        bg={completedBackround}
                        color={completedColor}
                        pl={2}
                        pr={2}
                      >
                        completed
                      </Box>
                    </ShowIf>
                  </Td>
                  <Td>{countDone(note.doubts)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ShowIf>
      </Box>
    </>
  )
}

export default Home
