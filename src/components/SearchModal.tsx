import {
  Modal,
  ModalOverlay,
  ModalContent,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightAddon,
} from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

import { actions, selectors } from 'modules/Note'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const SearchModal: FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const search = useSelector(selectors.selectSearch)

  const onChange = useCallback(
    (event: any) => {
      dispatch(actions.setSearch({ search: event.target.value }))
    },
    [dispatch]
  )
  const onRemove = useCallback(() => {
    dispatch(actions.setSearch({ search: null }))
    onClose()
  }, [dispatch, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form>
          <InputGroup>
            <InputLeftElement>
              <FiSearch />
            </InputLeftElement>
            <Input fontSize="3xl" onChange={onChange} placeholder="search" value={search || ''} />
            <InputRightAddon cursor="pointer" onClick={onRemove}>
              <FiX />
            </InputRightAddon>
          </InputGroup>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default SearchModal
