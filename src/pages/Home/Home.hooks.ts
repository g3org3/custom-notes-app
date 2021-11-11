import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
// @ts-ignore
import yaml from 'js-yaml'
// @ts-ignore
import { useNavigate } from '@reach/router'

import type { NoteType } from 'components/Note'
import { searchNotes } from 'components/Note/Note.service'
import { actions } from 'modules/Note'

export const useHome = (
  notesYaml: string | null,
  setNotesYaml: (text: string | null) => void
) => {
  const [placeHolderText, setPlaceHolderText] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [filteredNotes, setFN] = useState<Array<NoteType>>([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSearchChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setSearch(value)

  const readParseAndSetNotes = (value: string) => {
    setPlaceHolderText('done')
    const notes = yaml.loadAll(value)
    dispatch(actions.replaceNotes(notes.reverse()))
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
    if (document.location.pathname !== '/') {
      navigate('/')
      return
    }

    setPlaceHolderText('')
    setNotes(null)
    setFN([])
    setNotesYaml(null)
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
