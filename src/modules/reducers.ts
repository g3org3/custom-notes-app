import { enableMapSet } from 'immer'

import note from './Note'

enableMapSet()

export default {
  note: note.reducer,
}
