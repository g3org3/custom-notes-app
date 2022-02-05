import { Avatar, Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { FC } from 'react'

import { NoteDBType } from 'modules/Note'
import { dateToPretty, dateToPrettyTime } from 'services/date'

import Share from './Share'

interface Props {
  note: NoteDBType
  isReadOnly?: boolean
}

const NoteViewMeta: FC<Props> = ({ note, isReadOnly }) => {
  const tagBackground = useColorModeValue('blue.100', 'blue.900')
  const backgroundDate = useColorModeValue('gray.200', 'gray.700')
  const time = dateToPrettyTime(note.date)
  const date = dateToPretty(note.date)

  return (
    <Flex
      direction="column"
      alignItems="flex-start"
      flexShrink={{ base: 'unset', md: '0' }}
      position={{ base: 'relative', md: 'sticky' }}
      top={{ base: 'unset', md: '66.19px' }}
      lef={{ base: 'unset', md: '0' }}
    >
      <Flex alignItems="center" mt={2} mb={2}>
        <Flex gap={4}>
          {date && (
            <Text display="flex" padding="0 10px" bg={backgroundDate} title={note.date?.toISO()}>
              {date}
            </Text>
          )}
          {time && (
            <Text display="flex" padding="0 10px" bg={backgroundDate} title={note.date?.toISO()}>
              {time}
            </Text>
          )}
        </Flex>
      </Flex>

      {!!note.tags?.length && (
        <Flex direction="column" gap={1} mt={3}>
          <b>Tags:</b>
          <Flex display="inline-flex" gap={2}>
            {note.tags.map((name) => (
              <Text
                key={name}
                textTransform="capitalize"
                display="inline-block"
                bg={tagBackground}
                color="blue.500"
                padding="0 10px"
                borderRadius="full"
                fontSize="xs"
              >
                {name}
              </Text>
            ))}
          </Flex>
        </Flex>
      )}

      {!!note.people?.length && (
        <Flex flexDirection="column" mt={4}>
          <b>Attendees:</b>
          <Flex direction="column" gap={2}>
            {note.people.map((person) => (
              <Flex alignItems="center" gap={1}>
                <Avatar name={person} size="sm" />
                <Text textTransform="capitalize"> {person}</Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      )}

      {!isReadOnly && (
        <Flex gap={2} mt={4}>
          <Share noteId={note.id} />
        </Flex>
      )}
    </Flex>
  )
}

export default NoteViewMeta
