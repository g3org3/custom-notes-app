import {
  Box,
  Heading,
  useColorModeValue,
  Text,
  useToast,
  Flex,
  Icon,
  Link,
} from '@chakra-ui/react'
import yaml from 'js-yaml'
import { FC, useCallback } from 'react'
import { BsChevronRight } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link as ReachLink } from '@reach/router'
import { FiHome } from 'react-icons/fi'

import { useHotkeys } from 'react-hotkeys-hook'
import { Emoji } from 'emoji-mart'

import { dateToPretty, dateToPrettyTime } from 'services/date'
import ShowIf from 'components/Show'
import CheckList from 'components/CheckList'
import {
  actions,
  NoteDBType,
  selectFileHandler,
  selectIsThereAnyNotes,
  selectNoteById,
} from 'modules/Note'
import { readFileContent } from 'services/file'
import NoteContent from 'components/NoteContent'
import { inboundMapper } from 'services/notes'

interface Props {
  default?: boolean
  path?: string
  noteId?: string
}

const NoteId: FC<Props> = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const isThereAnyNotes = useSelector(selectIsThereAnyNotes)
  const note = useSelector(selectNoteById(props.noteId))
  const fileHandler = useSelector(selectFileHandler)
  const tagBackground = useColorModeValue('blue.100', 'blue.900')
  const backgroundDate = useColorModeValue('gray.200', 'gray.700')

  useHotkeys('esc', () => void navigate('/notes'), [navigate])
  useHotkeys(
    'r',
    () => {
      readFileContent(fileHandler)
        .then((content) => {
          // @ts-ignore
          const result = yaml.loadAll(content)
          if (result instanceof Array) {
            const notes: Array<NoteDBType> = result.flat().map(inboundMapper)
            dispatch(actions.replaceNotes({ notes }))
            toast({ title: 'notes updated', status: 'success' })
          } else {
            toast({
              title: 'Parse Error',
              description: 'Could not parse the given file',
              status: 'error',
            })
          }
        })
        .catch((err) => {
          toast({
            title: 'Parse Error',
            description: err.message,
            status: 'error',
          })
        })
    },
    [dispatch, fileHandler]
  )

  const onNextStepClick = useCallback(
    (index: number, value: string) => {
      if (!note) return

      dispatch(
        actions.toggleNextStep({
          noteId: note.id,
          nextStepIndex: index,
        })
      )
    },
    [dispatch, note]
  )

  if (!isThereAnyNotes || !note) {
    navigate('/')

    return null
  }

  const onDoubtClick = (index: number, value: string) => {
    dispatch(
      actions.toggleDoubt({
        noteId: note.id,
        doubtIndex: index,
      })
    )
  }

  return (
    <Flex direction="column" alignItems="flex-start">
      <Flex alignItems="center">
        <Link as={ReachLink} to="/notes">
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

      <Box display="flex" alignItems="center" mt={2} mb={2}>
        <ShowIf value={!!note.date}>
          <Text
            display="flex"
            padding="0 10px"
            bg={backgroundDate}
            title={note.date?.toISO()}
          >
            {dateToPretty(note.date)}
          </Text>
          <Text
            display="flex"
            padding="0 10px"
            ml="10px"
            bg={backgroundDate}
            title={note.date?.toISO()}
          >
            {dateToPrettyTime(note.date)}
          </Text>
        </ShowIf>

        <ShowIf value={!!note.tags}>
          <Box display="inline-flex" ml="10px" gap="10px">
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
        </ShowIf>
      </Box>

      <ShowIf value={!!note.people && note.people.length > 0}>
        <Box display="flex" gap="10px" mb={2}>
          <b>Attendees:</b>
          <Text textTransform="capitalize">{note.people?.join(', ')}</Text>
        </Box>
      </ShowIf>

      <NoteContent notes={note.notes} />

      <ShowIf value={!!note.doubts}>
        <Heading as="h3" size="md" mt={5} mb={2}>
          Doubts
        </Heading>
        <CheckList values={note.doubts} onClick={onDoubtClick} />
      </ShowIf>

      <ShowIf value={!!note.next_steps}>
        <Heading as="h3" size="md" mt={5} mb={2}>
          Next Steps
        </Heading>
        <CheckList values={note.next_steps} onClick={onNextStepClick} />
      </ShowIf>
    </Flex>
  )
}

export default NoteId
