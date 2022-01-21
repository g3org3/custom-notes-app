import type { NoteDBType, State } from './Note.slice'

interface Store {
  note: State
}

export const selectIsFilterNotFinished = (state: Store): boolean => {
  return state.note.isFilterNotFinished
}

export const selectNotes = (state: Store): Array<NoteDBType> | null => {
  const { byId } = state.note
  if (!byId) return null

  return Array.from(byId.values()).reverse()
}

export const selectIsThereAnyNotes = (state: Store): boolean => {
  return !!state.note.byId
}

export const selectNotesWithSearch = (
  state: Store
): Array<NoteDBType> | null => {
  const notes = selectNotes(state)
  if (!notes) return null

  const { search, filteredIds, isFilterNotFinished } = state.note

  if ((!isFilterNotFinished && !search) || search === '')
    return notes.sort((a, b) => {
      const adate = a.date ? a.date.toMillis() : 0
      const bdate = b.date ? b.date.toMillis() : 0
      return bdate - adate
    })

  return notes
    .filter((n) => filteredIds.includes(n.id))
    .sort((a, b) => {
      const adate = a.date ? a.date.toMillis() : 0
      const bdate = b.date ? b.date.toMillis() : 0
      return bdate - adate
    })
}

export const selectSearch = (state: Store): string | null => state.note.search

export const selectNoteById =
  (id?: string) =>
  (state: Store): NoteDBType | null => {
    if (!id || !state.note.byId) return null

    return state.note.byId.get(id) || null
  }

export const selectFileHandler = (state: Store) => state.note.fileHandler

export const selectFileName = (state: Store): string | null =>
  state.note.fileName

export const selectTags = (state: Store): any => {
  if (!state.note.byId) return []

  return Object.entries(
    Array.from(state.note.byId.values())
      .filter((note) => note.tags && note.tags[0] === note.subject)
      .reduce((_, t) => ({ ..._, [t.subject || '']: t.id }), {})
  )
}
