import React, { useContext } from 'react'

import RootContext from 'pages/Root/Root.context'

interface Props {
  children: React.ReactNode
}

const Pre = ({ children }: Props) => {
  const { isDarkTheme } = useContext(RootContext)

  return (
    <pre
      style={{
        background: isDarkTheme ? '#333' : '#eee',
        border: '1px solid #ccc',
        borderColor: isDarkTheme ? '#555' : '#ccc',
        padding: 0,
      }}
    >
      {children}
    </pre>
  )
}

export default Pre
