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
  Flex,
} from '@chakra-ui/react'
import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link as ReachLink } from '@reach/router'
import { useHotkeys } from 'react-hotkeys-hook'
import { FiSearch, FiX } from 'react-icons/fi'

import {
  selectFileName,
  selectIsThereAnyNotes,
  selectNotesWithSearch,
  selectSearch,
} from 'modules/Note/Note.selectors'
import { dateToPretty } from 'services/date'
import { completedList, countDone } from 'services/notes'
import ShowIf from 'components/Show'
import { actions } from 'modules/Note'
import { useAuth } from 'config/auth'

interface Props {
  default?: boolean
  path?: string
}

const Home: FC<Props> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const dispatch = useDispatch()
  const { currentUser } = useAuth()
  const isThereAnyNotes = useSelector(selectIsThereAnyNotes)
  const completedBackround = useColorModeValue('green.100', 'green.900')
  const completedColor = useColorModeValue('green.500', 'green.400')
  const tagBackground = useColorModeValue('blue.100', 'blue.900')
  const nsBackground = useColorModeValue('red.100', 'red.900')
  const search = useSelector(selectSearch)
  const notes = useSelector(selectNotesWithSearch)
  const filename = useSelector(selectFileName)
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
      <Box display="flex" flexDirection="column">
        <Heading as="h2">
          <span>📓 </span> {currentUser ? filename : 'Notes'}
        </Heading>
        {search && (
          <Box bg={completedBackround} color="green.500" textAlign="center">
            Filtered
          </Box>
        )}

        <ShowIf value={!!notes}>
          <Table
            variant="simple"
            size="sm"
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
            size="md"
            display={{ base: 'none', md: 'block' }}
          >
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Subject</Th>
                <Th>People</Th>
                <Th>Tags</Th>
                <Th>Next Steps</Th>
                <Th>Doubts</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notes?.map((note) => (
                <Tr key={note.id}>
                  <Td>
                    <Link as={ReachLink} to={`/notes/${note.id}`}>
                      {dateToPretty(note.date)}
                    </Link>
                  </Td>
                  <Td>
                    <Link as={ReachLink} to={`/notes/${note.id}`}>
                      <Text>{note.subject}</Text>
                    </Link>
                  </Td>
                  <Td maxWidth="300px">{note.people?.join(', ')}</Td>
                  <Td maxWidth="300px">
                    <Flex gap={2} wrap="wrap">
                      {note.tags?.map((tag) => (
                        <Box
                          display="inline-block"
                          bg={tagBackground}
                          color="blue.400"
                          pl={2}
                          pr={2}
                          borderRadius="full"
                        >
                          {tag}
                        </Box>
                      ))}
                    </Flex>
                  </Td>
                  <Td>
                    <ShowIf value={!completedList(note.next_steps)}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg={
                          completedList(note.next_steps) ||
                          countDone(note.next_steps) === ''
                            ? ''
                            : nsBackground
                        }
                        color={
                          completedList(note.next_steps) ||
                          countDone(note.next_steps) === ''
                            ? ''
                            : 'red.500'
                        }
                      >
                        {countDone(note.next_steps)}
                      </Box>
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
                  <Td>
                    <ShowIf value={!completedList(note.doubts)}>
                      {countDone(note.doubts)}
                    </ShowIf>
                    <ShowIf value={completedList(note.doubts)}>
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
