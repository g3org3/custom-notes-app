import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

import {
  searchNotes,
  toggleNextStepDone,
  toggleDoubtDone,
} from 'services/notes'
import { DateTime } from 'luxon'

type FileHandler = {}

export interface NoteType {
  id: string | null
  date: DateTime | null
  people: Array<string> | null
  subject: string | null
  notes: string | null
  next_steps: Array<string> | null
  emoji: string | null
  tags: Array<string> | null
  doubts: Array<string> | null
}

export interface NoteDBType extends NoteType {
  id: string
}

export interface State {
  byId: Map<string, NoteDBType> | null
  search: string | null
  filteredIds: Array<string>
  fileHandler: FileHandler | null
  fileName: string | null
}

export default createSlice({
  name: 'note',
  initialState: {
    byId: null,
    search: null,
    filteredIds: [],
    fileHandler: null,
    fileName: null,
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
    toggleDoubt: (
      state: State,
      action: {
        type: string
        payload: { noteId: string | null; doubtIndex: number }
      }
    ): void => {
      const { noteId, doubtIndex } = action.payload
      if (!state.byId || !noteId || !state.byId.get(noteId)) return

      const note = state.byId.get(noteId)

      if (!note) return

      const newNote = toggleDoubtDone(note, doubtIndex)
      state.byId.set(noteId, newNote)
    },
    reset: (state: State) => {
      state.byId = null
      state.search = null
      state.filteredIds = []
      state.fileHandler = null
      state.fileName = null
    },
    setFileName: (
      state: State,
      action: { type: string; payload: { fileName: string } }
    ) => {
      state.fileName = action.payload.fileName
    },
    setFileHandler: (
      state: State,
      action: { type: string; payload: { fileHandler: FileHandler } }
    ) => {
      state.fileHandler = action.payload.fileHandler
    },
    setSearch: (
      state: State,
      action: { type: string; payload: { search: string | null } }
    ): void => {
      state.search = action.payload.search
      if (state.byId == null) return

      if (!state.search) {
        state.filteredIds = []
        return
      }

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
        const idv4 = uuidv4()
        const { id, subject, ...rest } = note

        byId.set(id || idv4, { subject, id: id || idv4, ...rest })

        return byId
      }, new Map())

      return
    },
  },
})
