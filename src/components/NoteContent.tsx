import { Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import { FC, memo, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import Markdown from 'components/Markdown'

interface Props {
  notes: string | null
}

const NoteContent: FC<Props> = ({ notes }) => {
  const [isMarkdown, setIsMarkdown] = useState(true)
  const theme = useColorModeValue(atomOneLight, atomOneDark)
  const backgroundDate = useColorModeValue('gray.200', 'gray.700')

  if (!notes) return null

  return (
    <>
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
        <Markdown value={notes} />
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
          {notes}
        </SyntaxHighlighter>
      )}
    </>
  )
}

export default memo(NoteContent)
