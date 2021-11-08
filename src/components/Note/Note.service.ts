import { createFTS } from 'services/full-text-search'
import type { NoteType } from './Note.component'

export const searchNotes = (
  search: string,
  notes: Array<NoteType> | null
): Array<NoteType> => {
  if (!notes) return []
  if (!search || search.trim() === '') return notes

  const fts = createFTS(search)

  const isInAnyFields = (note: NoteType) => {
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
