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
    <StyledCard onClick={onClick}>
      <Typography
        sx={{
          fontSize: 16,
          display: 'inline-block',
          marginLeft: '10px',
          width: '90px',
        }}
        color="text.secondary"
      >
        <pre>{dateToPretty(date)}</pre>
      </Typography>
      <Typography
        sx={{
          marginLeft: '10px',
          borderLeft: '1px solid #ccc',
          fontSize: 20,
          display: 'inline-block',
          paddingLeft: '10px',
          flexGrow: 1,
        }}
        color="text.primary"
      >
        {subject || 'No Subject'}
      </Typography>

      <Typography
        sx={{ fontSize: 16, display: 'inline-block', marginLeft: '10px' }}
        color="text.primary"
      >
        {people && (
          <Typography sx={{ display: 'inline-block' }}>
            {people.map(capitalize).map(removeVocals).join(', ')}
          </Typography>
        )}
      </Typography>
    </StyledCard>
  )
}

export default SimpleNote
