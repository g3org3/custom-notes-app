import { configureStore } from '@reduxjs/toolkit'

import reducers from './reducers'

export default configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'note/replaceNotes',
          'note/setFileHandler',
          'note/add',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.notes.date'],
        // Ignore these paths in the state
        ignoredPaths: ['note.byId', 'note.fileHandler'],
      },
    }),
})
