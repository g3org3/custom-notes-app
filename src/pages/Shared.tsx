import { Flex, Heading, useMediaQuery, useToast } from '@chakra-ui/react'
import { RouteComponentProps } from '@reach/router'
import { FC, useState, useCallback, useEffect } from 'react'

import DesktopTable from 'components/DesktopTable'
import MobileTable from 'components/MobileTable'
import NoteView from 'components/NoteView'
// import { useOnSharedNotes, useOnSharedNotesRefs } from 'hooks/share'
import { useSecuredCtx } from 'lib/PrivateRoute'
import { NoteDBType } from 'modules/Note'

interface Props extends RouteComponentProps {}

const Shared: FC<Props> = (props) => {
  const { currentUser } = useSecuredCtx()
  console.log(currentUser)
  const toast = useToast()
  const [note, setNote] = useState(null)
  // const shared = useOnSharedNotesRefs(currentUser.email)
  // const notes = useOnSharedNotes(currentUser.email)
  const notes = [] as Array<NoteDBType>
  console.log('Shared:render', currentUser.email, note, notes.length)
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
