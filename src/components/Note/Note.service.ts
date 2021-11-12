import { createFTS } from 'services/full-text-search'
import type { NoteDBType } from 'modules/Note'

export const isNextStepDone = (nextStep?: string) => {
  if (!nextStep) return false

  return nextStep.indexOf('(done) ') !== -1
}

export const toggleNextStepDone = (
  note: NoteDBType,
  index: number
): NoteDBType => {
  if (!note.next_steps) return note

  const nextStep = note.next_steps[index]
  const isDone = isNextStepDone(nextStep)

  if (!isDone) {
    note.next_steps[index] = '(done) ' + nextStep
  } else {
    note.next_steps[index] = nextStep.split('(done) ').join('')
  }

  return note
}

export const getNextStepsStats = (note: NoteDBType): Array<number> => {
  if (!note.next_steps) return []

  const doneCount = note.next_steps?.reduce((doneCount, nextStep) => {
    return isNextStepDone(nextStep) ? doneCount + 1 : doneCount
  }, 0)

  return [doneCount, note.next_steps?.length]
}

export const searchNotes = (
  search: string,
  notes: Array<NoteDBType> | null
): Array<NoteDBType> => {
  if (!notes) return []
  if (!search || search.trim() === '') return notes

  const fts = createFTS(search)

  const isInAnyFields = (note: NoteDBType) => {
    let blobOfText = ''

    if (!!note.notes) {
      blobOfText += ' ' + note.notes
    }
    if (!!note.people) {
      blobOfText += ' ' + note.people.join(' ')
    }
    if (!!note.subject) {
      blobOfText += ' ' + note.subject
    }
    if (!!note.tags) {
      blobOfText += ' ' + note.tags.join(' ')
    }
    if (!!note.doubts) {
      blobOfText += ' ' + note.doubts.join(' ')
    }
    if (!!note.next_steps) {
      blobOfText += ' ' + note.next_steps.join(' ')
    }

    console.log(blobOfText)

    return fts(blobOfText)
  }

  const notesMatchedQuery = notes.filter((note) => isInAnyFields(note))

  return notesMatchedQuery
}
