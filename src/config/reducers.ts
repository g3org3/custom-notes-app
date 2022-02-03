import { enableMapSet } from 'immer'

import note from 'modules/Note'

enableMapSet()

const reducers = {
  note: note.reducer,
}

export default reducers
