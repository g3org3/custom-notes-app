import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import Pre from 'components/Pre'

interface Props {
  data: any
  isArray?: boolean
  label: string
}

const Code = ({ isArray, data, label }: Props) => {
  const [isMarkdown, setIM] = useState(true)

  return (isArray && !!data && data.length > 0) || (!isArray && !!data) ? (
    <div style={{ marginTop: '20px' }}>
      {label}:{' '}
      <span onClick={() => setIM(!isMarkdown)} style={{ cursor: 'pointer' }}>
        {isMarkdown ? <b>(markdown)</b> : '(markdown)'}
      </span>
      {isArray || !isMarkdown ? (
        <Pre>{isArray ? JSON.stringify(data, null, 2) : data}</Pre>
      ) : (
        <div style={{ border: '1px solid #ccc', padding: '4px' }}>
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
  ) : null
}

export default Code
