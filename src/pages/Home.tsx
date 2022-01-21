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
  Button,
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
  selectIsFilterNotFinished,
  selectTags,
} from 'modules/Note'
import { dateToPretty } from 'services/date'
import { completedList, countDone } from 'services/notes'
import ShowIf from 'components/Show'
import { actions } from 'modules/Note'
import { useAuth } from 'config/auth'
import { Emoji } from 'emoji-mart'

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
  const stripedTableBackground = useColorModeValue('gray.100', 'gray.700')
  const search = useSelector(selectSearch)
  const notes = useSelector(selectNotesWithSearch)
  const tags = useSelector(selectTags)
  const isFilterNotFinished = useSelector(selectIsFilterNotFinished)
  const filename = useSelector(selectFileName)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useHotkeys(
    '/',
    (e) => {
      e.preventDefault()
      onOpen()
    },
    [onOpen]
  )

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

  const handleNotFinished = () => {
    dispatch(actions.toggleNotFinished())
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
              fontSize="3xl"
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
      <Flex>
        <Flex
          direction="column"
          mr={4}
          gap={4}
          height="calc(100vh - 88px)"
          overflow="auto"
        >
          <Button>All Notes</Button>
          <Button
            bg={isFilterNotFinished ? 'green' : 'gray.700'}
            onClick={handleNotFinished}
          >
            Not Finished
          </Button>
          {/* @ts-ignore */}
          {tags.map(([tag, id]) => (
            <Link as={ReachLink} to={`/notes/${id}`}>
              <Button key={tag}>{tag}</Button>
            </Link>
          ))}
        </Flex>
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          height="calc(100vh - 88px)"
          overflow="auto"
        >
          <Heading
            as="h2"
            position="sticky"
            top="0"
            bg={useColorModeValue('gray', 'gray.800')}
          >
            <span>📓 </span>{' '}
            {currentUser ? filename || 'Untitled.txt' : 'Notes'}
          </Heading>
          {search && (
            <Box
              bg={completedBackround}
              color="green.500"
              textAlign="center"
              mb={3}
              mt={3}
            >
              Filtered
            </Box>
          )}

          <ShowIf value={!!notes}>
            <Flex
              display={{ base: 'inline-flex', md: 'none' }}
              direction="column"
              borderTop="1px solid black"
              borderColor={stripedTableBackground}
              mt={2}
            >
              {notes?.map((note, i) => (
                <Box
                  key={note.id}
                  display="flex"
                  flexDirection="column"
                  background={i % 2 === 0 ? stripedTableBackground : ''}
                  pl={2}
                  pb={2}
                  cursor="pointer"
                  as={ReachLink}
                  _hover={{ background: 'gray.300' }}
                  to={`/notes/${note.id}`}
                >
                  <Text fontSize="24px">{note.subject || 'Untitled'}</Text>
                  <Text>{note.date?.toISODate()}</Text>
                </Box>
              ))}
            </Flex>

            <Table
              variant="simple"
              display={{ base: 'none', md: 'inline-table' }}
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
                    <Td fontFamily="monospace">
                      <Link as={ReachLink} to={`/notes/${note.id}`}>
                        {dateToPretty(note.date)}
                      </Link>
                    </Td>
                    <Td>
                      <Link
                        as={ReachLink}
                        to={`/notes/${note.id}`}
                        display="flex"
                        alignItems="center"
                        gap={2}
                      >
                        <Text>
                          <Emoji
                            set="google"
                            emoji={note.emoji || ''}
                            size={24}
                          />
                        </Text>
                        <Text>{note.subject}</Text>
                      </Link>
                    </Td>
                    <Td maxWidth="300px">{note.people?.join(', ')}</Td>
                    <Td maxWidth="300px">
                      <Flex gap={2} wrap="wrap">
                        {note.tags?.map((tag) => (
                          <Box
                            key={tag}
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
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
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
      </Flex>
    </>
  )
}

export default Home
