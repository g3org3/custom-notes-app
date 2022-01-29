import base64 from 'base-64'
import { User } from 'firebase/auth'
import { DateTime } from 'luxon'
import { useState, useEffect } from 'react'

import { dbOnValue } from 'config/firebase'
import { NoteDBType } from 'modules/Note'

export type SharedNotes = {
  noteRefs: Array<{ ref: string; noteId?: string }>
}

export const useGetSharedNotesRefs = (currentUser: User | null) => {
  const [val, setval] = useState<SharedNotes | undefined>(undefined)

  useEffect(() => {
    if (!currentUser || !currentUser.email) return

    const email = base64.encode(currentUser.email)
    dbOnValue(`/share/${email}`, (snap) => {
      const snapshot = snap.val()
      if (!snapshot) {
        setval({ noteRefs: [] })

        return
      }

      const refs = Object.values(snapshot) as Array<string>
      const noteRefs = refs.map((path) => {
        const paths = path.split(':')
        const noteId = paths.pop()
        const ref = 'users/' + paths.join('/')

        return { ref, noteId }
      })

      setval({ noteRefs })
    })
  }, [currentUser])

  return val
}

export const useGetSharedNotes = (shared?: SharedNotes) => {
  const [val, setval] = useState<Array<NoteDBType>>([])

  useEffect(() => {
    if (!shared || !shared.noteRefs.length) return
    const { ref } = shared.noteRefs[0]
    dbOnValue(ref, (snap) => {
      const snapshot = snap.val()
      if (!snapshot) {
        setval([])

        return
      }

      const note = {
        ...snapshot,
        // @ts-ignore
        date: DateTime.fromISO(snapshot.date).isValid
          ? // @ts-ignore
            DateTime.fromISO(snapshot.date)
          : null,
      }

      setval([note])
    })
  }, [shared])

  return val
}
