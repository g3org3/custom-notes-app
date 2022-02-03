import { Box, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react'
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
  const backgroundDate = useColorModeValue('gray.100', 'gray.700')

  if (!notes) return null

  return (
    <Flex direction="column" gap={2}>
      <Flex direction="row" alignItems="center" gap={2}>
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
      <Box
        width={{ base: 'calc(100vw - 20px)', md: 'unset' }}
        flex={{ base: 'unset', md: 'unset' }}
        overflow="auto"
        height={{ base: 'unset', md: 'calc(100vh - 290px)' }}
        border="1px"
        padding={4}
        borderColor={backgroundDate}
      >
        {isMarkdown ? (
          <Markdown value={notes} />
        ) : (
          <SyntaxHighlighter
            customStyle={{
              fontSize: '14px',
            }}
            language="markdown"
            style={theme}
          >
            {notes}
          </SyntaxHighlighter>
        )}
      </Box>
    </Flex>
  )
}

export default memo(NoteContent)
