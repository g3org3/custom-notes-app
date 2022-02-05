import {
  Heading,
  Text,
  useToast,
  useColorModeValue,
  Button,
  Flex,
  Spacer,
  useClipboard,
} from '@chakra-ui/react'
import { useNavigate } from '@reach/router'
import { FC, useCallback, useEffect, useState } from 'react'
import { FiCopy } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { selectIsThereAnyNotes, selectNotes } from 'modules/Note/Note.selectors'
import { notesToYaml } from 'services/notes'

interface Props {
  default?: boolean
  path?: string
}

const Empty: FC<Props> = () => {
  const navigate = useNavigate()
  const [generate, setGenerate] = useState(false)
  const isThereAnyNotes = useSelector(selectIsThereAnyNotes)
  const theme = useColorModeValue(atomOneLight, atomOneDark)
  const notes = useSelector(selectNotes)
  const toast = useToast()
  const notesInYaml = generate ? notesToYaml(notes) : ''
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
    <Flex p={4} direction="column">
      <Heading as="h2">
        <span> 📦 </span> Export
      </Heading>
      <Flex mt={4}>
        <Button onClick={() => setGenerate(true)} colorScheme="green">
          Generate Yaml
        </Button>
      </Flex>
      <Flex mb={4} alignItems="flex-end" width="60vw">
        <Text>Yaml output from all your notes</Text>
        <Spacer />
        <Button leftIcon={<FiCopy />} size="sm" onClick={handleOnClick}>
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>
      </Flex>
      <SyntaxHighlighter
        customStyle={{
          width: '60vw',
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
    </Flex>
  )
}

export default Empty
