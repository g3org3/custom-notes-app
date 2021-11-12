import { useState } from 'react'
import Typography from '@mui/material/Typography'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import Pre from 'components/Pre'

interface Props {
  data: any
  isArray?: boolean
}

const Code = ({ isArray, data }: Props) => {
  const [isMarkdown, setIM] = useState(true)

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
        <Pre>{isArray ? JSON.stringify(data, null, 2) : data}</Pre>
      ) : (
        <div style={{}}>
          <ReactMarkdown
            children={data}
            components={{
              table: ({ node, ...props }) => (
                <table {...props} className="table" />
              ),
            }}
            remarkPlugins={[remarkGfm]}
          />
        </div>
      )}
    </div>
  )
}

export default Code
