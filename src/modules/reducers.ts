import { enableMapSet } from 'immer'

import note from './Note'

enableMapSet()

const reducers = {
  note: note.reducer,
}

export default reducers
