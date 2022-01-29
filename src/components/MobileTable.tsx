import { Box, Text, Flex, Link, useColorModeValue, Spacer } from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { Emoji } from 'emoji-mart'
import { FC, memo } from 'react'
import { useSelector } from 'react-redux'

import { NoteDBType, selectors } from 'modules/Note'
import { countDone } from 'services/notes'

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
  const style = {
    bg: {
      table: useColorModeValue('gray.100', 'gray.900'),
      hover: useColorModeValue('gray.200', 'gray.700'),
    },
    color: {
      date: useColorModeValue('gray.500', 'gray'),
    },
  }
  const getLinkProps = (note: NoteDBType) =>
    props.onClickNote && typeof props.onClickNote === 'function'
      ? { onClick: props.onClickNote(note) }
      : { as: LLink, to: `/notes/${note.id}` }

  return (
    <Flex direction="column" mt={2}>
      {notes?.map((note, i) => (
        <Box
          key={note.id}
          display="flex"
          flexDirection="column"
          background={i % 2 === 0 ? style.bg.table : ''}
          pl={2}
          pb={2}
          cursor="pointer"
          _hover={{ background: style.bg.hover, boxShadow: 'md' }}
          {...getLinkProps(note)}
        >
          <Flex alignItems="center" gap={2}>
            <Emoji emoji={note.emoji || ''} size={24} />
            <Text fontSize="24px">{note.subject || 'Untitled'}</Text>
          </Flex>
          <Flex alignItems="center" gap={2}>
            <Text>ns: {countDone(note.next_steps)}</Text>
            <Spacer />
            <Text fontFamily="mono">{note.date?.toISODate()}</Text>
          </Flex>
        </Box>
      ))}
    </Flex>
  )
}

export default memo(MobileTable)
