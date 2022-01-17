import {
  Box,
  Heading,
  Text,
  useToast,
  useColorModeValue,
  Button,
  Flex,
  Spacer,
  useClipboard,
} from '@chakra-ui/react'
import { FC, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { FiCopy } from 'react-icons/fi'
import {
  atomOneDark,
  atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useNavigate } from '@reach/router'

import { notesToYaml } from 'services/notes'
import { selectIsThereAnyNotes, selectNotes } from 'modules/Note/Note.selectors'

interface Props {
  default?: boolean
  path?: string
}

const Empty: FC<Props> = () => {
  const navigate = useNavigate()
  const isThereAnyNotes = useSelector(selectIsThereAnyNotes)
  const theme = useColorModeValue(atomOneLight, atomOneDark)
  const notes = useSelector(selectNotes)
  const toast = useToast()
  const notesInYaml = notesToYaml(notes)
  const { hasCopied, onCopy } = useClipboard(notesInYaml)

  useEffect(() => {
    if (!isThereAnyNotes) {
      toast({ title: 'You do not have any notes', status: 'warning' })
      navigate('/')
    }
    // eslint-disable-next-line
  }, [])

  const handleOnClick = useCallback(() => {
    onCopy()
    toast({ title: 'Copied yaml to clipboard', status: 'success' })
  }, [toast, onCopy])

  return (
    <Box>
      <Heading as="h2">
        <span> 📦 </span> Export
      </Heading>
      <br />
      <Flex mb={4} alignItems="flex-end">
        <Text>Yaml output from all your notes</Text>
        <Spacer />
        <Button leftIcon={<FiCopy />} size="sm" onClick={handleOnClick}>
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>
      </Flex>
      <SyntaxHighlighter
        customStyle={{
          width: '90vw',
          height: '50vh',
          overflow: 'auto',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          border: '1px solid #ccc',
        }}
        language="yaml"
        style={theme}
      >
        {notesInYaml}
      </SyntaxHighlighter>
    </Box>
  )
}

export default Empty
