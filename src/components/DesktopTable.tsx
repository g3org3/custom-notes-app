import { Flex, Box, Text, Table, Thead, Th, Tbody, Tr, Td, Link, useColorModeValue } from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { Emoji } from 'emoji-mart'
import { FC } from 'react'
import { useSelector } from 'react-redux'

import ShowIf from 'components/Show'
import { selectors } from 'modules/Note'
import { dateToPretty } from 'services/date'
import { completedList, countDone } from 'services/notes'
import { removeVocals } from 'services/string'

interface Props {
  //
}

const DesktopTable: FC<Props> = () => {
  const completedColor = useColorModeValue('green.500', 'green.400')
  const tagBackground = useColorModeValue('blue.100', 'blue.900')
  const nsBackground = useColorModeValue('red.100', 'red.900')
  const completedBackround = useColorModeValue('green.100', 'green.900')
  const notes = useSelector(selectors.selectNotesWithSearch)

  return (
    <Table variant="simple" display={{ base: 'none', md: 'inline-table' }}>
      <Thead>
        <Tr>
          <Th minWidth="150px">Date</Th>
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
                tabIndex={-1}
                as={ReachLink}
                to={`/notes/${note.id}`}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Text>
                  <Emoji set="google" emoji={note.emoji || ''} size={24} />
                </Text>
                <Text>{note.subject}</Text>
              </Link>
            </Td>
            <Td maxWidth="300px">{note.people?.map(removeVocals).join(', ')}</Td>
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
                  bg={completedList(note.next_steps) || countDone(note.next_steps) === '' ? '' : nsBackground}
                  color={completedList(note.next_steps) || countDone(note.next_steps) === '' ? '' : 'red.500'}
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
              <ShowIf value={!completedList(note.doubts)}>{countDone(note.doubts)}</ShowIf>
              <ShowIf value={completedList(note.doubts)}>
                <Box display="inline-block" bg={completedBackround} color={completedColor} pl={2} pr={2}>
                  completed
                </Box>
              </ShowIf>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default DesktopTable
