import {
  Box,
  Heading,
  useToast,
  useDisclosure,
  useColorModeValue,
  Flex,
  useMediaQuery,
} from '@chakra-ui/react'
import { FC, memo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from '@reach/router'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  selectFileName,
  selectIsThereAnyNotes,
  selectSearch,
} from 'modules/Note'

import { useAuth } from 'config/auth'
import SearchModal from 'components/SearchModal'
import FilterBar from 'components/FilterBar'
import MobileTable from 'components/MobileTable'
import DesktopTable from 'components/DesktopTable'

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
  const isDesktop = useMediaQuery('(min-width: 48em')
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
        <FilterBar />
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          height="calc(100vh - 88px)"
          overflow="auto"
        >
          <Heading
            as="h2"
            position="sticky"
            top="0"
            bg={useColorModeValue('white', 'gray.800')}
          >
            <span>📓 </span>{' '}
            {currentUser ? filename || 'Untitled.txt' : 'Notes'}
          </Heading>
          {search && (
            <Box
              bg={filterbg}
              color="green.500"
              textAlign="center"
              mb={3}
              mt={3}
            >
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
