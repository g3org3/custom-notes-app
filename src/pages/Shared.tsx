import { Flex, Heading, useMediaQuery, useToast } from '@chakra-ui/react'
import { FC, useState, useCallback, useEffect } from 'react'

import DesktopTable from 'components/DesktopTable'
import MobileTable from 'components/MobileTable'
import NoteView from 'components/NoteView'
import { useAuth } from 'config/auth'
import { useGetSharedNotes, useGetSharedNotesRefs } from 'services/share'

interface Props {
  default?: boolean
  path?: string
}

const Shared: FC<Props> = (props) => {
  const toast = useToast()
  const [note, setNote] = useState(null)
  const { currentUser } = useAuth()
  const shared = useGetSharedNotesRefs(currentUser)
  const notes = useGetSharedNotes(shared)
  const [isDesktop] = useMediaQuery('(min-width: 768px)')

  const onClick = useCallback(() => {
    toast({ title: 'not supported for shared notes', status: 'error' })
  }, [toast])

  useEffect(() => {
    if (!note) return
    // @ts-ignore
    const newNote = notes.filter((n) => n.id === note.id)[0]
    // @ts-ignore
    setNote(newNote)
    // eslint-disable-next-line
  }, [notes])

  const onClickNote = useCallback(
    (note) => () => {
      setNote(note)
    },
    [setNote]
  )

  const onClickHome = useCallback(
    (e: any) => {
      e.preventDefault()
      setNote(null)
    },
    [setNote]
  )

  return (
    <Flex direction="column">
      {!note && <Heading>Shared Notes</Heading>}
      {!note && isDesktop && <DesktopTable onClickNote={onClickNote} notes={notes} />}
      {!note && !isDesktop && <MobileTable onClickNote={onClickNote} notes={notes} />}
      {!!note && (
        <NoteView
          onClickHome={onClickHome}
          note={note}
          onClickDoubt={onClick}
          onClickNextStep={onClick}
          readOnly
        />
      )}
    </Flex>
  )
}

export default Shared
