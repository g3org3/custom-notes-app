import { useToast } from '@chakra-ui/react'
import base64 from 'base-64'
import { useDispatch, useSelector } from 'react-redux'

import { dbSet } from 'config/firebase'
import { useAuth } from 'lib/auth'
import { actions } from 'modules/Note'
import { selectFileHandler, selectFileName, selectNotes } from 'modules/Note/Note.selectors'
import { openAndSaveToFile, saveToFile } from 'services/file'
import { notesToYaml } from 'services/notes'

export const useSave = () => {
  const toast = useToast()
  const dispatch = useDispatch()
  const { currentUser } = useAuth()
  const fileHandler = useSelector(selectFileHandler)
  const storeFileName = useSelector(selectFileName)
  const notes = useSelector(selectNotes)

  const saveNotesToFile = (event: any) => {
    if (event && event.preventDefault && typeof event.preventDefault === 'function') {
      event.preventDefault()
    }

    if (!notes || notes.length === 0) {
      toast({ title: 'There are no notes to save', status: 'error' })

      return
    }

    if (currentUser && storeFileName) {
      const { uid, displayName, email } = currentUser
      const name64 = base64.encode(storeFileName)
      const payload = {
        id: name64,
        name: storeFileName,
        notes: notes.map((n) => ({
          ...n,
          date: n.date ? n.date.toISO() : null,
        })),
      }
      dbSet(`/users/${uid}/notes`, name64, payload)
      dbSet(`/users/${uid}`, 'displayName', displayName)
      dbSet(`/users/${uid}`, 'email', email)
      dbSet(`/users/${uid}`, 'id', uid)
    }

    const notesInYaml = notesToYaml(notes)

    if (!fileHandler) {
      openAndSaveToFile(notesInYaml)
        .then((fh) => {
          dispatch(actions.setFileHandler({ fileHandler: fh }))
          const fileName = fh.name
          dispatch(actions.setFileName({ fileName }))
          toast({ title: 'Saved', status: 'success' })
        })
        .catch((err) => {
          toast({
            title: 'Error to save file',
            description: err.message,
            status: 'error',
          })
        })

      return
    }

    saveToFile(fileHandler, notesInYaml)
      .then(() => {
        toast({ title: 'Saved', status: 'success' })
      })
      .catch((err) => {
        toast({
          title: 'Error to save file',
          description: err.message,
          status: 'error',
        })
      })
  }

  return { saveNotesToFile }
}
