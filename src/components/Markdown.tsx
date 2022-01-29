import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  useColorModeValue,
  Code,
  Table,
  Td,
  Th,
  Tbody,
  Tr,
  Thead,
  Text,
  Heading,
  UnorderedList,
  ListItem,
  OrderedList,
  Flex,
  Link,
} from '@chakra-ui/react'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import remarkGfm from 'remark-gfm'

interface Props {
  value?: string | null
}

const Markdown: FC<Props> = ({ value }) => {
  const theme = useColorModeValue(atomOneLight, atomOneDark)
  if (!value) return null

  return (
    <Flex direction="column" alignItems="flex-start" gap={4} overflow="auto">
      <ReactMarkdown
        children={value}
        components={{
          table: ({ children }) => (
            <Table
              border="1px solid"
              borderColor="gray.200"
              variant="striped"
              colorScheme="gray"
              size="sm"
              width="auto"
            >
              {children}
            </Table>
          ),
          thead: ({ children }) => <Thead>{children}</Thead>,
          tr: ({ children }) => <Tr>{children}</Tr>,
          th: ({ children }) => <Th>{children}</Th>,
          td: ({ children }) => <Td>{children}</Td>,
          h2: ({ children }) => <Heading as="h3">{children}</Heading>,
          ul: ({ children }) => <UnorderedList>{children}</UnorderedList>,
          ol: ({ children }) => <OrderedList>{children}</OrderedList>,
          li: ({ children }) => <ListItem>{children}</ListItem>,
          p: ({ children }) => <Text display="block">{children}</Text>,
          a: ({ children, href }) => (
            <Link
              href={href || ''}
              target="_blank"
              color="blue.500"
              display="inline-flex"
              alignItems="center"
              gap={1}
            >
              {children}
              <ExternalLinkIcon />
            </Link>
          ),
          tbody: ({ children }) => <Tbody>{children}</Tbody>,
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')

            return !inline && match ? (
              <SyntaxHighlighter language={match[1]} style={theme}>
                {children.join('')}
              </SyntaxHighlighter>
            ) : (
              <Code colorScheme="red">{children}</Code>
            )
          },
        }}
        remarkPlugins={[remarkGfm]}
      />
    </Flex>
  )
}

export default Markdown
