import {
  Box,
  Heading,
  useToast,
  useDisclosure,
  useColorModeValue,
  Flex,
  useMediaQuery,
} from '@chakra-ui/react'
import { useNavigate } from '@reach/router'
import { FC, memo, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useSelector } from 'react-redux'

import DesktopTable from 'components/DesktopTable'
import FilterBar from 'components/FilterBar'
import MobileTable from 'components/MobileTable'
import SearchModal from 'components/SearchModal'
import { useAuth } from 'config/auth'
import { selectFileName, selectIsThereAnyNotes, selectSearch } from 'modules/Note'

interface Props {
  default?: boolean
  path?: string
}

const Home: FC<Props> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { currentUser } = useAuth()
  const isThereAnyNotes = useSelector(selectIsThereAnyNotes)
  const search = useSelector(selectSearch)
  const filterbg = useColorModeValue('green.100', 'green.900')
  const [isDesktop] = useMediaQuery('(min-width: 768px)')
  const filename = useSelector(selectFileName)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useHotkeys(
    '/',
    (e) => {
      e.preventDefault()
      onOpen()
    },
    [onOpen]
  )

  useEffect(() => {
    if (!isThereAnyNotes) {
      toast({ title: 'You do not have any notes', status: 'warning' })
      navigate('/')
    }
  }, [isThereAnyNotes, toast, navigate])

  return (
    <>
      <SearchModal isOpen={isOpen} onClose={onClose} />
      <Flex>
        {isDesktop ? <FilterBar /> : null}
        <Box display="flex" flexDirection="column" flex={1} height="calc(100vh - 88px)" overflow="auto">
          <Heading as="h2" position="sticky" top="0" bg={useColorModeValue('white', 'gray.800')}>
            <span>📓 </span> {currentUser ? filename || 'Untitled.txt' : 'Notes'}
          </Heading>
          {search && (
            <Box bg={filterbg} color="green.500" textAlign="center" mb={3} mt={3}>
              Filtered
            </Box>
          )}
          {isDesktop ? <DesktopTable /> : <MobileTable />}
        </Box>
      </Flex>
    </>
  )
}

export default memo(Home)
