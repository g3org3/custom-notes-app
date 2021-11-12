import type { NoteDBType, State } from './Note.slice'

interface Store {
  note: State
}

export const selectNotes = (state: Store): Array<NoteDBType> | null => {
  const { byId, search, filteredIds } = state.note
  if (!byId) return null

  const notes = Array.from(byId.values())

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
