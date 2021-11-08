import React from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'

import Pre from '../../components/Pre'
import { exampleNotesYaml } from './yaml.example'

interface Props {
  text: string
  onChange: (event: any) => void
}

const Empty = (props: Props) => {
  const { text, onChange } = props

  return (
    <Paper sx={{ padding: '20px 15px' }}>
      <Typography>
        Paste your notes below. (expecting them to be in yaml)
      </Typography>
      <TextField
        multiline
        placeholder="paste your YAML notes here"
        rows={2}
        value={text}
        sx={{ width: '100%', margin: '20px 0' }}
        onChange={onChange}
      />
      <Pre>{exampleNotesYaml}</Pre>
    </Paper>
  )
}

export default Empty
