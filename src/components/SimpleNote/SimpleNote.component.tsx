import React from 'react'
import Typography from '@mui/material/Typography'

import { dateToPretty } from '../../services/date'
import type { NoteType } from '../../components/Note'
import { StyledCard } from './SimpleNote.style'
import { capitalize, removeVocals } from '../../services/string'

interface Props {
  onClick: () => void
  note: NoteType
}

const SimpleNote = (props: Props) => {
  const { onClick, note } = props
  const { subject, people, date } = note

  return (
    <StyledCard onClick={onClick} elevation={3}>
      <pre style={{ margin: 0, width: '90px' }}>{dateToPretty(date)}</pre>
      <Typography
        sx={{
          borderLeft: '1px solid #ccc',
          fontSize: 16,
          display: 'inline-block',
          paddingLeft: '10px',
          flexGrow: 1,
        }}
        color="text.primary"
      >
        {subject || 'No Subject'}
      </Typography>

      <Typography
        sx={{ fontSize: 13, display: 'inline-block' }}
        color="text.primary"
      >
        {people && people.map(capitalize).map(removeVocals).join(', ')}
      </Typography>
    </StyledCard>
  )
}

export default SimpleNote
