import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

import { searchNotes, toggleNextStepDone } from 'components/Note/Note.service'

export interface NoteType {
  date?: Date
  people?: Array<string>
  subject?: string
  notes?: string
  next_steps?: Array<string>
  tags?: Array<string>
  doubts?: Array<string>
  time?: string
}

export interface NoteDBType extends NoteType {
  id: string
}

export interface State {
  byId: Map<string, NoteDBType> | null
  search: string | null
  filteredIds: Array<string>
}

export default createSlice({
  name: 'note',
  initialState: {
    byId: null,
    search: null,
    filteredIds: [],
  },
  reducers: {
    toggleNextStep: (
      state: State,
      action: {
        type: string
        payload: { noteId: string | null; nextStepIndex: number }
      }
    ): void => {
      const { noteId, nextStepIndex } = action.payload
      if (!state.byId || !noteId || !state.byId.get(noteId)) return

      const note = state.byId.get(noteId)

      if (!note) return

      const newNote = toggleNextStepDone(note, nextStepIndex)
      state.byId.set(noteId, newNote)
    },
    reset: (state: State) => {
      state.byId = null
      state.search = null
    },
    setSearch: (
      state: State,
      action: { type: string; payload: { search: string } }
    ): void => {
      state.search = action.payload.search
      if (state.byId == null) return

      const notes = Array.from(state.byId.values())
      const filteredNotes = searchNotes(state.search, notes)
      state.filteredIds = filteredNotes.map((note) => note.id)
    },
    replaceNotes: (
      state: State,
      action: { type: string; payload: { notes: Array<NoteType> | null } }
    ): void => {
      const { notes } = action.payload

      if (!notes) {
        state.byId = null
        return
      }

      state.byId = notes.reduce((byId, note) => {
        const id = uuidv4()
        byId.set(id, { id, ...note })

        return byId
      }, new Map())

      return
    },
  },
})
