import {
  Box,
  Heading,
  useColorModeValue,
  Text,
  Flex,
  Icon,
  Link,
  Avatar,
  useMediaQuery,
} from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { Emoji } from 'emoji-mart'
import { FC } from 'react'
import { BsChevronRight } from 'react-icons/bs'
import { FiHome } from 'react-icons/fi'

import CheckList from 'components/CheckList'
import NoteContent from 'components/NoteContent'
import Share from 'components/Share'
import ShowIf from 'components/Show'
import { NoteDBType } from 'modules/Note'
import { dateToPretty, dateToPrettyTime } from 'services/date'

import FilterBar from './FilterBar'
import { nav } from './Layout'

interface Props {
  note: NoteDBType
  onClickDoubt: (index: number, value: string) => void
  onClickHome?: (e: any) => void
  onClickNextStep: (index: number, value: string) => void
  readOnly?: boolean
}

const NoteView: FC<Props> = ({ onClickHome, note, onClickNextStep, onClickDoubt, readOnly }) => {
  const tagBackground = useColorModeValue('blue.100', 'blue.900')
  const backgroundDate = useColorModeValue('gray.200', 'gray.700')
  const [isDesktop] = useMediaQuery('(min-width: 768px)')

  return (
    <Flex height={`calc(100vh - ${nav.h + nav.py.md + nav.py.md}px)`} overflow="auto">
      {isDesktop ? <FilterBar isCompacted /> : null}
      <Flex direction="column">
        <Flex alignItems="center" mb={4} borderBottom="1px" borderColor="gray.400">
          <Link as={ReachLink} to="/notes" onClick={onClickHome}>
            <Icon as={FiHome} fontSize={30} />
          </Link>
          <Icon as={BsChevronRight} color="gray.300" fontSize={30} />
          <Heading as="h2">
            {note.emoji ? (
              <Box display="inline-block" mr="8px">
                <Emoji set="google" emoji={note.emoji} size={40} />
              </Box>
            ) : null}
            {note.subject}
          </Heading>
        </Flex>
        <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 0, md: 10 }}>
          <Flex
            direction="column"
            alignItems="flex-start"
            height={{ base: 'unset', md: 'calc(100vh - 98px)' }}
            width={{ base: 'unset', md: '300px' }}
            top="0px"
            left="0px"
            position={{ base: 'relative', md: 'sticky' }}
          >
            <Box display="flex" alignItems="center" mt={2} mb={2}>
              <ShowIf value={!!note.date}>
                <Flex gap={4}>
                  <Text display="flex" padding="0 10px" bg={backgroundDate} title={note.date?.toISO()}>
                    {dateToPretty(note.date)}
                  </Text>
                  <Text display="flex" padding="0 10px" bg={backgroundDate} title={note.date?.toISO()}>
                    {dateToPrettyTime(note.date)}
                  </Text>
                </Flex>
              </ShowIf>
            </Box>

            <ShowIf value={!!note.tags}>
              <Flex direction="column" gap={1} mt={3}>
                <b>Tags:</b>
                <Box display="inline-flex" gap={2}>
                  {note.tags?.map((name) => (
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
                </Box>
              </Flex>
            </ShowIf>

            <ShowIf value={!!note.people && note.people.length > 0}>
              <Box display="flex" flexDirection="column" mt={4}>
                <b>Attendees:</b>
                <Flex direction="column" gap={2}>
                  {note.people?.map((person) => (
                    <Flex alignItems="center" gap={1}>
                      <Avatar name={person} size="sm" />
                      <Text textTransform="capitalize"> {person}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            </ShowIf>

            {!readOnly && (
              <Flex gap={2} mt={4}>
                <Share noteId={note.id} />
              </Flex>
            )}
          </Flex>

          <Flex direction={{ base: 'column', md: 'row' }} alignItems="flex-start">
            <NoteContent notes={note.notes} />
            <Flex direction="column" ml={10}>
              <ShowIf value={!!note.doubts}>
                <Heading as="h3" size="md" mt={5} mb={2}>
                  Doubts
                </Heading>
                <CheckList values={note.doubts} onClick={onClickDoubt} />
              </ShowIf>

              <ShowIf value={!!note.next_steps}>
                <Heading as="h3" size="md" mt={5} mb={2}>
                  Next Steps
                </Heading>
                <CheckList values={note.next_steps} onClick={onClickNextStep} />
              </ShowIf>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default NoteView
