import Paper from '@mui/material/Paper'
import { useSelector } from 'react-redux'
import yaml from 'js-yaml'

import { selectNotes } from 'modules/Note/Note.selectors'

interface Props {
  path?: string
}

const Export = (props: Props) => {
  const notes = useSelector(selectNotes)
  const str = yaml.dump(notes, {
    sortKeys: true,
    noArrayIndent: true,
  })

  return (
    <Paper>
      <pre>{str}</pre>
    </Paper>
  )
}

export default Export
