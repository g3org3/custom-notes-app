import { useNavigate } from '@reach/router'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import type { NoteDBType } from 'modules/Note'
import { getNextStepsStats } from 'components/Note/Note.service'
import { dateToPretty } from 'services/date'
import { capitalize, removeVocals } from 'services/string'

interface Props {
  path?: string
  notes: Array<NoteDBType> | null
}

const NoteList = (props: Props) => {
  const navigate = useNavigate()
  const { notes } = props

  if (notes === null || notes.length === 0) {
    return <Typography>No notes found</Typography>
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Attendees</TableCell>
            <TableCell>Questions</TableCell>
            <TableCell>Next Steps</TableCell>
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
              onClick={() => navigate(`/${note.id}`)}
            >
              <TableCell>{dateToPretty(note.date) || 'N/A'}</TableCell>
              <TableCell>{note.subject || 'No subject'}</TableCell>
              <TableCell>
                {note.people &&
                  note.people.map(capitalize).map(removeVocals).join(', ')}
              </TableCell>
              <TableCell>{note.doubts?.length}</TableCell>
              <TableCell>{getNextStepsStats(note).join(' / ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default NoteList
