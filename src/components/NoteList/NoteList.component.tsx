import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import type { NoteType } from 'components/Note'
import Note from 'components/Note'
import { dateToPretty } from 'services/date'
import { capitalize, removeVocals } from 'services/string'

interface Props {
  path?: string
  notes: Array<NoteType>
}

const NoteList = (props: Props) => {
  const [openedNote, setOpenedNote] = useState<NoteType | null>(null)
  const { notes } = props
  if (notes.length === 0) {
    return <Typography>No notes found</Typography>
  }

  if (openedNote != null) {
    return <Note note={openedNote} onCloseClick={() => setOpenedNote(null)} />
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Attendees</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notes.map((note, i) => (
            <TableRow
              key={`id-${i}`}
              sx={{
                cursor: 'pointer',
                '&:last-child td, &:last-child th': { border: 0 },
              }}
              onClick={() => setOpenedNote(note)}
            >
              <TableCell>{dateToPretty(note.date) || 'N/A'}</TableCell>
              <TableCell>{note.subject || 'No subject'}</TableCell>
              <TableCell>
                {note.people &&
                  note.people.map(capitalize).map(removeVocals).join(' ,')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default NoteList
