import { Text, Flex, Link, useColorModeValue, Spacer, Code, Badge, Image } from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { Emoji } from 'emoji-mart'
import { FC, memo } from 'react'
import { useSelector } from 'react-redux'

import { NoteDBType, selectors } from 'modules/Note'
import { completedList, countDone } from 'services/notes'
import { subList } from 'services/string'

interface Props {
  notes?: Array<NoteDBType>
  onClickNote?: (note: NoteDBType) => () => void
}

const LLink = memo((props: any) => <Link as={ReachLink} {...props} />)

const MobileTable: FC<Props> = (props) => {
  let notes = useSelector(selectors.selectNotesWithSearch)
  if (props.notes) {
    notes = props.notes
  }
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const getLinkProps = (note: NoteDBType) =>
    props.onClickNote && typeof props.onClickNote === 'function'
      ? { onClick: props.onClickNote(note) }
      : { as: LLink, to: `/notes/${note.id}` }

  return (
    <Flex direction="column" mt={2}>
      {notes?.map((note, i) => (
        <Flex
          key={note.id}
          direction="row"
          mx={5}
          px={2}
          py={4}
          gap={2}
          alignItems="center"
          borderBottom="1px"
          borderColor={borderColor}
          cursor="pointer"
          _hover={{ background: 'blackAlpha.100' }}
          _active={{ background: 'blackAlpha.200' }}
          {...getLinkProps(note)}
        >
          <Flex height="40px" width="40px" overflow="hidden">
            <Emoji set="google" emoji={note.emoji || ''} size={40} />
          </Flex>
          <Flex direction="column">
            <Flex alignItems="center" gap={2}>
              <Text fontWeight="bold" fontSize="24px" display="flex" gap={2} alignItems="center">
                {note.subject || 'Untitled'}
                <Badge colorScheme={completedList(note?.next_steps) ? 'green' : 'red'}>
                  {countDone(note?.next_steps) === '' ? '' : countDone(note.next_steps)}
                </Badge>
              </Text>
              <Spacer />
              <Text color="blue.500">{subList(note.people, 2)}</Text>
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Text color="gray.500" fontFamily="mono">
                {note.date?.toISODate()}
              </Text>
              <Spacer />
              <Text color="gray.500" fontFamily="mono">
                {note.date?.toRelative()}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}

export default memo(MobileTable)
