import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'

import { dateToISO } from 'services/date'
import type { NoteType } from 'components/Note'
import CheckboxList from 'components/CheckboxList'

interface Props {
  path?: string
  notes: Array<NoteType> | null
}

const NextSteps = (props: Props) => {
  const [nextSteps, setNextSteps] = useState<Array<string>>([])
  const { notes } = props

  useEffect(() => {
    const filteredNextSteps = (notes || [])
      .filter((note) => !!note.next_steps)
      .map((note) =>
        note.next_steps?.map(
          (x) =>
            `${x} [${dateToISO(note.date)}] [${
              note.subject || note.tags?.join(',')
            }]`
        )
      )
      .flat()
      .filter(Boolean)
      .map((x, i) => `${i} | ${x}`)

    setNextSteps(filteredNextSteps)
  }, [notes])

  const handleRemove = (_: string, index: number) => {
    const newNextSteps = [
      ...nextSteps.slice(0, index),
      ...nextSteps.slice(index + 1),
    ]
    setNextSteps(newNextSteps)
  }

  return (
    <Paper>
      <CheckboxList items={nextSteps} onItemClick={handleRemove} />
    </Paper>
  )
}

export default NextSteps
