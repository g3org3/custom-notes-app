import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import type { NoteDBType } from 'modules/Note'
import { actions } from 'modules/Note'
import { isNextStepDone } from 'components/Note/Note.service'
import CheckboxList from 'components/CheckboxList'

interface Props {
  path?: string
  notes: Array<NoteDBType> | null
}

const filterHasNextSteps = (note: NoteDBType) => {
  if (!note.next_steps) return false

  return (
    note.next_steps.filter((nextStep) => !isNextStepDone(nextStep)).length > 0
  )
}

const notesWithNextSteps = (note: NoteDBType) =>
  note.next_steps
    ?.filter((nextStep: string) => !isNextStepDone(nextStep))
    .map((x: string) => ({ id: note.id, label: x })) || []

const Section = ({
  title,
  items,
  handleRemove,
}: {
  title: string
  items: Array<{ id?: string; label: string }>
  handleRemove: (
    index: number,
    item: { id?: string | null; label: string }
  ) => void
}) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div>
      <Button onClick={() => setCollapsed(!collapsed)}>
        <Typography sx={{ fontSize: '16px' }}>{title}</Typography>
      </Button>
      {!collapsed && <CheckboxList items={items} onItemClick={handleRemove} />}
    </div>
  )
}

const NextSteps = (props: Props) => {
  const dispatch = useDispatch()
  const { notes } = props

  const handleRemove = (
    index: number,
    item: { id?: string | null; label: string }
  ) => {
    dispatch(
      actions.toggleNextStep({
        noteId: item.id || null,
        nextStepIndex: index,
      })
    )
  }

  if (!notes || notes.filter(filterHasNextSteps).length === 0) {
    console.log(notes)
    return <Paper sx={{ padding: '20px' }}>Nothing left to do</Paper>
  }

  const fileteredNotes = notes.filter(filterHasNextSteps)

  return (
    <Paper sx={{ padding: '10px' }}>
      {fileteredNotes.map((note) => (
        <Section
          title={note.subject || 'No Subject'}
          items={notesWithNextSteps(note)}
          handleRemove={handleRemove}
        />
      ))}
    </Paper>
  )
}

export default NextSteps
