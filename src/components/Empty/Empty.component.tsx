import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'

import Pre from 'components/Pre'
import { exampleNotesYaml } from './yaml.example'

interface Props {
  path?: string
  text: string
  onChange: (event: any) => void
  onOpenFileClick: (event: any) => void
}

const Empty = (props: Props) => {
  const { text, onChange, onOpenFileClick } = props

  return (
    <Paper sx={{ padding: '20px 15px' }}>
      <Typography>
        Open the file you would like to use
      </Typography>
      <Button variant="outlined" onClick={onOpenFileClick}>Open File</Button>
      <hr />
      <Typography>
        Or paste your notes below. (expecting them to be in yaml)
      </Typography>
      <TextField
        multiline
        placeholder="paste your YAML notes here"
        rows={2}
        value={text}
        sx={{ width: '100%', margin: '20px 0' }}
        onChange={onChange}
      />
      <hr />
      <Pre>{exampleNotesYaml}</Pre>
    </Paper>
  )
}

export default Empty
