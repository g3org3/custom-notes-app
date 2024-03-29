import * as _selectors from './Note.selectors'
import slice from './Note.slice'

export * from './Note.selectors'
export type { NoteType, NoteDBType } from './Note.slice'

export const selectors = _selectors
export const actions = slice.actions
export const reducer = slice.reducer

export default slice
