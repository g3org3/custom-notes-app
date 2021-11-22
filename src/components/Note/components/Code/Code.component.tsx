import { useState, useContext } from 'react'
import Typography from '@mui/material/Typography'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import Pre from 'components/Pre'
import RootContext from 'pages/Root/Root.context';


interface Props {
  data: any
  isArray?: boolean
}

const Code = ({ isArray, data }: Props) => {
  const [isMarkdown, setIM] = useState(true)
  const { isDarkTheme } = useContext(RootContext)
  const theme = isDarkTheme ? atomOneDark : atomOneLight

  if ((isArray && (!data || data.length === 0)) || (!isArray && !data)) {
    return null
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <pre>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 'bold',
            display: 'inline-block',
            marginTop: '20px',
          }}
        >
          Notes:
        </Typography>
        <span onClick={() => setIM(!isMarkdown)} style={{ cursor: 'pointer' }}>
          {!isMarkdown ? ' (markdown)' : ' (plain/text)'}
        </span>
      </pre>
      {isArray || !isMarkdown ? (
        <>{isArray ? <Pre>{JSON.stringify(data, null, 2)}</Pre>
          : <SyntaxHighlighter language="markdown" style={theme}>
            {data}
          </SyntaxHighlighter>}
        </>
      ) : (
        <div style={{}}>
          <ReactMarkdown
            children={data}
            components={{
              table: ({ node, ...props }) => (
                <table {...props} className="table" />
              ),
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter language={match[1]} style={theme}>
                    {children.join('')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
            remarkPlugins={[remarkGfm]}
          />
        </div>
      )}
    </div>
  )
}

export default Code
