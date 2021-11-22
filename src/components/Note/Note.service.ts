import { createFTS } from 'services/full-text-search'
import type { NoteDBType } from 'modules/Note'

export const isLineDone = (line?: string) => {
  if (!line) return false

  return line.indexOf('(done) ') !== -1
}

export const toggleLineDone = (
  note: NoteDBType,
  index: number,
  listName: string,
): NoteDBType => {
  // @ts-ignore
  if (!note[listName]) return note

  // @ts-ignore
  const line = note[listName][index]
  const isDone = isLineDone(line)

  if (!isDone) {
    // @ts-ignore
    note[listName][index] = '(done) ' + line
  } else {
    // @ts-ignore
    note[listName][index] = line.split('(done) ').join('')
  }

  return note
}

export const toggleNextStepDone = (
  note: NoteDBType,
  index: number
): NoteDBType => toggleLineDone(note, index, 'next_steps')

export const toggleDoubtDone = (
  note: NoteDBType,
  index: number
): NoteDBType => toggleLineDone(note, index, 'doubts')

export const getNextStepsStats = (note: NoteDBType): Array<number> => {
  if (!note.next_steps) return []

  const doneCount = note.next_steps?.reduce((doneCount, nextStep) => {
    return isLineDone(nextStep) ? doneCount + 1 : doneCount
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

    return fts(blobOfText)
  }

  const notesMatchedQuery = notes.filter((note) => isInAnyFields(note))

  return notesMatchedQuery
}
