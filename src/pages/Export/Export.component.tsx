import Paper from '@mui/material/Paper'
import { createRef, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { selectNotes } from 'modules/Note/Note.selectors'
import { notesToYaml } from 'modules/Note/Note.service'
import RootContext from 'pages/Root/Root.context'

interface Props {
  path?: string
}

const ref = createRef<HTMLTextAreaElement>()

const Export = (props: Props) => {
  const notes = useSelector(selectNotes)
  const str = notesToYaml(notes)
  const { isDarkTheme } = useContext(RootContext)
  const theme = isDarkTheme ? atomOneDark : atomOneLight

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.select()
        document.execCommand('copy')
        toast.success('Copied to clipboard')
      }
    }, 1000)
  }, [])

  return (
    <Paper sx={{ padding: '20px' }}>
      <SyntaxHighlighter language="yaml" style={theme}>
        {str}
      </SyntaxHighlighter>
      <textarea
        style={{ position: 'fixed', top: -1000 }}
        ref={ref}
        value={str}
      />
    </Paper>
  )
}

export default Export
