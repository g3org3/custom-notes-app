import base64 from 'base-64'
import { DateTime } from 'luxon'
import { useCallback } from 'react'

import { useOnValueWithMapper } from 'lib/db'
import { NoteDBType } from 'modules/Note'

export type SharedNotes = {
  noteRefs: Array<{ ref: string; noteId?: string }>
}

export type DictStr = { [key: string]: string }

export const useOnSharedNotesRefs = (_email?: string | null): SharedNotes => {
  const email = base64.encode(_email || 'unknown')

  const mapper = useCallback((snapshot: DictStr | null | undefined): SharedNotes => {
    if (!snapshot) return { noteRefs: [] }

    const refs = Object.values(snapshot) as Array<string>

    const noteRefs = refs.map((path) => {
      const paths = path.split(':')
      const noteId = paths.pop()
      const ref = 'users/' + paths.join('/')

      return { ref, noteId }
    })

    return { noteRefs }
  }, [])

  return useOnValueWithMapper<DictStr, SharedNotes>(`share/${email}`, mapper)
}

export const useOnSharedNotes = (shared: SharedNotes): Array<NoteDBType> => {
  const [ref] = shared.noteRefs.concat([{ ref: 'unknown' }])

  const mapper = useCallback((snapshot?: NoteDBType | null): Array<NoteDBType> => {
    if (!snapshot) {
      return []
    }

    const note = {
      ...snapshot,
      // @ts-ignore
      date: DateTime.fromISO(snapshot.date).isValid
        ? // @ts-ignore
          DateTime.fromISO(snapshot.date)
        : null,
    }

    return [note]
  }, [])

  return useOnValueWithMapper<NoteDBType, Array<NoteDBType>>(ref.ref, mapper)
}
