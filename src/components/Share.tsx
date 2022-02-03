import { Button, Icon, Input } from '@chakra-ui/react'
import base64 from 'base-64'
import { FC, useRef } from 'react'
import { FiShare2 } from 'react-icons/fi'
import { useSelector } from 'react-redux'

import { dbPush } from 'config/firebase'
import { useAuth } from 'lib/auth'
import { selectors } from 'modules/Note'

interface Props {
  noteId?: string
}

const Share: FC<Props> = (props) => {
  const ref = useRef<HTMLInputElement>()
  const { currentUser } = useAuth()
  const notes = useSelector(selectors.selectNotes)
  const fileName = useSelector(selectors.selectFileName)
  const note = useSelector(selectors.selectNoteById(props.noteId))

  const onClickShare = () => {
    if (!ref || !ref.current || !currentUser || !props.noteId || !note || !fileName) return

    const email = base64.encode(ref.current.value)
    const index = notes?.indexOf(note)
    const fileId = base64.encode(fileName)
    dbPush(`/share/${email}/`, `${currentUser.uid}:notes:${fileId}:notes:${index}:${props.noteId}`)
    ref.current.value = ''
  }

  return (
    <>
      {/* @ts-ignore */}
      <Input ref={ref} placeholder="Email to share with" />
      <Button px={4} onClick={onClickShare} colorScheme="teal" leftIcon={<Icon as={FiShare2} />}>
        Share
      </Button>
    </>
  )
}

export default Share
