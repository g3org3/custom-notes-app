import slice from './Note.slice'

export type { NoteType, NoteDBType } from './Note.slice'

export const actions = slice.actions
export const reducer = slice.reducer

export default slice
