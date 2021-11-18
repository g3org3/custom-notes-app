import type { NoteDBType, State } from './Note.slice'

interface Store {
  note: State
}

export const selectNotes = (state: Store): Array<NoteDBType> | null => {
  const { byId } = state.note
  if (!byId) return null

  return Array.from(byId.values()).reverse()
}

export const selectNotesWithSearch = (state: Store): Array<NoteDBType> | null => {
  const notes = selectNotes(state)
  if (!notes) return null

  const { search, filteredIds } = state.note
  if (!search || search === '') return notes

  return notes.filter((n) => filteredIds.includes(n.id))
}

export const selectSearch = (state: Store): string | null => state.note.search

export const selectNoteById = (id?: string) => (
  state: Store
): NoteDBType | null => {
  if (!id || !state.note.byId) return null

  return state.note.byId.get(id) || null
}

export const selectFileHandler = (state: Store) => state.note.fileHandler
