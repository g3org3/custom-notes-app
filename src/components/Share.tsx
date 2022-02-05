import { Button, Flex, Input, InputGroup, InputRightAddon } from '@chakra-ui/react'
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
    <Flex direction="column">
      <form>
        <InputGroup>
          {/* @ts-ignore */}
          <Input ref={ref} placeholder="Share to this email" />
          <InputRightAddon cursor="pointer" onClick={onClickShare}>
            <FiShare2 />
          </InputRightAddon>
        </InputGroup>
        <Button type="submit" display="none">
          Share
        </Button>
      </form>
    </Flex>
  )
}

export default Share
