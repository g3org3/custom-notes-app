import { Flex, Box, Text, Table, Thead, Th, Tbody, Tr, Td, Link, useColorModeValue } from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { Emoji } from 'emoji-mart'
import { FC } from 'react'
import { useSelector } from 'react-redux'

import ShowIf from 'components/Show'
import { NoteDBType, selectors } from 'modules/Note'
import { dateToPretty } from 'services/date'
import { completedList, countDone } from 'services/notes'

interface Props {
  notes?: Array<NoteDBType>
  onClickNote?: (note: NoteDBType) => () => void
}

const DesktopTable: FC<Props> = (props) => {
  const completedColor = useColorModeValue('green.500', 'green.400')
  const tagBackground = useColorModeValue('blue.50', 'blue.900')
  const nsBackground = useColorModeValue('red.100', 'red.900')
  const completedBackround = useColorModeValue('green.100', 'green.900')
  let notes = useSelector(selectors.selectNotesWithSearch)
  if (props.notes) {
    notes = props.notes
  }
  const getLinkProps = (note: NoteDBType) =>
    props.onClickNote && typeof props.onClickNote === 'function'
      ? { onClick: props.onClickNote(note) }
      : { as: ReachLink, to: `/notes/${note.id}` }

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
              {/* @ts-ignore */}
              <Link {...getLinkProps(note)}>{dateToPretty(note.date)}</Link>
            </Td>
            <Td>
              {/* @ts-ignore */}
              <Link {...getLinkProps(note)} tabIndex={-1} display="flex" alignItems="center" gap={2}>
                <Text>
                  <Emoji set="google" emoji={note.emoji || ''} size={24} />
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
