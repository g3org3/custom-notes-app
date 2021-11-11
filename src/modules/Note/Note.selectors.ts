import type { NoteDBType, State } from './Note.slice'

interface Store {
  note: State
}

export const selectNotes = (state: Store): Array<NoteDBType> | null => {
  if (!state.note.byId) return null

  return Array.from(state.note.byId.values())
}

export const selectSearch = (state: Store): string | null => state.note.search

export const selectNoteById = (id?: string) => (
  state: Store
): NoteDBType | null => {
  if (!id || !state.note.byId) return null

  return state.note.byId.get(id) || null
}
