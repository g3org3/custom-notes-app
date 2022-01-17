import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {
  atomOneDark,
  atomOneLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'
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
} from '@chakra-ui/react'

interface Props {
  value?: string | null
}

const Markdown: FC<Props> = ({ value }) => {
  const theme = useColorModeValue(atomOneLight, atomOneDark)
  if (!value) return null

  return (
    <ReactMarkdown
      children={value}
      components={{
        table: ({ children }) => (
          <Table variant="simple" size="sm">
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
  )
}

export default Markdown
