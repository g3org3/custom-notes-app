import Paper from '@mui/material/Paper'
import { createRef } from 'react'
import { useSelector } from 'react-redux'
import yaml from 'js-yaml'

import { selectNotes } from 'modules/Note/Note.selectors'
import Pre from 'components/Pre'

interface Props {
  path?: string
}

const ref = createRef<HTMLTextAreaElement>()

const Export = (props: Props) => {
  const notes = useSelector(selectNotes)
  const str = yaml.dump(notes, {
    // sortKeys: true,
    noArrayIndent: true,
  })

  setTimeout(() => {
    if (ref.current) {
      ref.current.select()
      document.execCommand('copy')
    }
  }, 1000)

  return (
    <Paper sx={{ padding: '20px' }}>
      <Pre>{str}</Pre>
      <textarea
        style={{ position: 'fixed', top: -1000 }}
        ref={ref}
        value={str}
      />
    </Paper>
  )
}

export default Export
