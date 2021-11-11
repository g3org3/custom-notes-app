import { useState, useEffect } from 'react'
// @ts-ignore
import yaml from 'js-yaml'
// @ts-ignore
import { useNavigate } from '@reach/router'

import type { NoteType } from 'components/Note'
import { searchNotes } from 'components/Note/Note.service'

export const useHome = (
  notesYaml: string | null,
  setNotesYaml: (text: string | null) => void
) => {
  const [notes, setNotes] = useState<Array<NoteType> | null>(null)
  const [placeHolderText, setPlaceHolderText] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [filteredNotes, setFN] = useState<Array<NoteType>>([])
  const navigate = useNavigate()

  const onSearchChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setSearch(value)

  const readParseAndSetNotes = (value: string) => {
    setPlaceHolderText('done')
    setNotesYaml(value)
    const notes = yaml.loadAll(value)
    setNotes(notes.reverse())
  }

  const onCopyPasteYaml = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const { inputType } = event.nativeEvent
    const { value } = event.target

    setPlaceHolderText(value)

    if (inputType !== 'insertFromPaste') return

    setPlaceHolderText('loading...')
    setTimeout(() => readParseAndSetNotes(value), 1000)
  }

  const resetAppState = () => {
    setPlaceHolderText('')
    setNotes(null)
    setFN([])
    setNotesYaml(null)
    navigate('/')
  }

  useEffect(() => {
    if (notes === null && notesYaml !== '' && notesYaml != null) {
      readParseAndSetNotes(notesYaml)
    }
    setFN(searchNotes(search, notes))
    // eslint-disable-next-line
  }, [search, notes, notesYaml])

  return {
    filteredNotes,
    notes,
    onCopyPasteYaml,
    onSearchChange,
    placeHolderText,
    resetAppState,
    search,
  }
}
