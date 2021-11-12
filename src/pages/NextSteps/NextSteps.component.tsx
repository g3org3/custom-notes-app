import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Paper from '@mui/material/Paper'

import { dateToISO } from 'services/date'
import type { NoteDBType } from 'modules/Note'
import { actions } from 'modules/Note'
import { isNextStepDone } from 'components/Note/Note.service'
import CheckboxList from 'components/CheckboxList'

interface Props {
  path?: string
  notes: Array<NoteDBType> | null
}

type Item = {
  id?: string | null
  label: string
}

const NextSteps = (props: Props) => {
  const dispatch = useDispatch()
  const [nextSteps, setNextSteps] = useState<Array<Item>>([])
  const { notes } = props

  useEffect(() => {
    if (!notes) return

    const filteredNextSteps = notes
      .filter((note) => !!note.next_steps)
      .map((note) =>
        note.next_steps?.map((x: string) => ({
          id: note.id,
          label: `${x} [${dateToISO(note.date) || ''}] [${
            note.subject || note.tags?.join(',') || ''
          }]`,
        }))
      )
      .flat()
      .filter(Boolean)
      .filter((x) => !isNextStepDone(x?.label))
      .map((x, i) => ({
        ...x,
        label: `${i} | ${x?.label}`,
      }))

    setNextSteps(filteredNextSteps)
  }, [notes])

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

  return (
    <Paper>
      {nextSteps.length === 0 ? (
        'Nothing left to do'
      ) : (
        <CheckboxList items={nextSteps} onItemClick={handleRemove} />
      )}
    </Paper>
  )
}

export default NextSteps
