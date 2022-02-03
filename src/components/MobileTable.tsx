import { Text, Flex, Link, useColorModeValue, Spacer } from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { Emoji } from 'emoji-mart'
import { FC, memo } from 'react'
import { useSelector } from 'react-redux'

import { NoteDBType, selectors } from 'modules/Note'
import { countDone } from 'services/notes'
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
          direction="column"
          mx={5}
          px={2}
          py={4}
          borderBottom="1px"
          borderColor={borderColor}
          cursor="pointer"
          _hover={{ background: 'blackAlpha.100' }}
          _active={{ background: 'blackAlpha.200' }}
          {...getLinkProps(note)}
        >
          <Flex alignItems="center" gap={2}>
            <Emoji emoji={note.emoji || ''} size={24} />
            <Text fontWeight="bold" fontSize="24px">
              {note.subject || 'Untitled'}
              {countDone(note?.next_steps) === '' ? '' : '*'}
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
      ))}
    </Flex>
  )
}

export default memo(MobileTable)
