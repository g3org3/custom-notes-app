import {
  Modal,
  ModalOverlay,
  ModalContent,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightAddon,
  Button,
} from '@chakra-ui/react'
import { FC, RefObject, useCallback, useRef } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useDispatch } from 'react-redux'

import { actions } from 'modules/Note'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const SearchModal: FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const ref = useRef() as RefObject<HTMLInputElement>

  const onSubmit = (e: any) => {
    console.log('submit')
    e.preventDefault()
    const value = ref.current?.value || ''
    dispatch(actions.setSearch({ search: value }))
    onClose()
  }

  const onRemove = useCallback(() => {
    dispatch(actions.setSearch({ search: null }))
    onClose()
  }, [dispatch, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p={4}>
        <form onSubmit={onSubmit}>
          <InputGroup>
            <InputLeftElement>
              <FiSearch />
            </InputLeftElement>
            <Input _focus={{ boxShadow: 'none' }} border={0} fontSize="2xl" ref={ref} placeholder="search" />
            <InputRightAddon cursor="pointer" onClick={onRemove}>
              <FiX />
            </InputRightAddon>
          </InputGroup>
          <Button type="submit" display="none">
            submit
          </Button>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default SearchModal
