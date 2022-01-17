import {
  Box,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Text,
  useToast,
  Flex,
  Divider,
} from '@chakra-ui/react'
import yaml from 'js-yaml'
import { FC, useState } from 'react'
import { BsChevronRight } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link as ReachLink } from '@reach/router'
import { FiHome } from 'react-icons/fi'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {
  atomOneDark,
  atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  selectFileHandler,
  selectIsThereAnyNotes,
  selectNoteById,
} from 'modules/Note/Note.selectors'
import { dateToPretty, dateToPrettyTime } from 'services/date'
import ShowIf from 'components/Show'
import CheckList from 'components/CheckList'
import { actions, NoteDBType } from 'modules/Note'
import Markdown from 'components/Markdown'
import { readFileContent } from 'services/file'
import { DateTime } from 'luxon'

interface Props {
  default?: boolean
  path?: string
  noteId?: string
}

const NoteId: FC<Props> = (props) => {
  const [isMarkdown, setIsMarkdown] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const isThereAnyNotes = useSelector(selectIsThereAnyNotes)
  const note = useSelector(selectNoteById(props.noteId))
  const fileHandler = useSelector(selectFileHandler)
  const theme = useColorModeValue(atomOneLight, atomOneDark)
  const tagBackground = useColorModeValue('teal.100', 'teal.700')
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
            const notes: Array<NoteDBType> = result.flat().map((n) => ({
              subject: n.s || n.subject || null,
              id: n.id || null,
              emoji: n.e || n.emoji || null,
              date: DateTime.fromJSDate(n.d || n.date).isValid
                ? DateTime.fromJSDate(n.d || n.date)
                : null,
              tags: n.t || n.tags || null,
              people: n.p || n.people || null,
              notes: n.n || n.notes || null,
              doubts: n.q || n.doubts || null,
              next_steps: n.ns || n.next_steps || null,
            }))
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

  if (!isThereAnyNotes || !note) {
    navigate('/')

    return null
  }

  const onNextStepClick = (index: number, value: string) => {
    dispatch(
      actions.toggleNextStep({
        noteId: note.id,
        nextStepIndex: index,
      })
    )
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
    <Box>
      <Breadcrumb
        display="inline-flex"
        separator={<BsChevronRight color="gray.300" />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={ReachLink} to="/notes">
            <FiHome />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>
            <Heading as="h2">
              {note.emoji ? (
                <Box display="inline-block" mr="8px">
                  {note.emoji}
                </Box>
              ) : null}
              {note.subject}
            </Heading>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

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

      <Divider color="gray.400" />

      <ShowIf value={!!note.notes}>
        <Flex mt={5} mb={2} direction="row" alignItems="center" gap={2}>
          <Heading as="h3" size="md">
            Notes
          </Heading>
          <Text
            cursor="pointer"
            onClick={() => setIsMarkdown(!isMarkdown)}
            fontSize="xs"
            bg={backgroundDate}
            pl={2}
            pr={2}
            color="gray.500"
          >
            {isMarkdown ? 'markdown' : 'yaml'}
          </Text>
        </Flex>
        {isMarkdown ? (
          <Markdown value={note.notes} />
        ) : (
          <SyntaxHighlighter
            customStyle={{
              width: '90vw',
              fontSize: '14px',
              border: '1px solid #ccc',
            }}
            language="markdown"
            style={theme}
          >
            {note.notes}
          </SyntaxHighlighter>
        )}
      </ShowIf>

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
    </Box>
  )
}

export default NoteId
