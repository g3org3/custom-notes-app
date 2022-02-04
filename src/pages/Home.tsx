import { Box, Heading, useToast, useColorModeValue, Flex, useMediaQuery, Icon } from '@chakra-ui/react'
import { useNavigate } from '@reach/router'
import { FC, memo, useEffect } from 'react'
import { FiZap, FiZapOff } from 'react-icons/fi'
import { useSelector } from 'react-redux'

import DesktopTable from 'components/DesktopTable'
import FilterBar from 'components/FilterBar'
import { fullHeight } from 'components/Layout'
import MobileTable from 'components/MobileTable'
import { useSecuredCtx } from 'lib/PrivateRoute'
import { selectFileHandler, selectFileName, selectIsThereAnyNotes, selectSearch } from 'modules/Note'

interface Props {
  default?: boolean
  path?: string
}

const Home: FC<Props> = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { currentUser } = useSecuredCtx()
  const isThereAnyNotes = useSelector(selectIsThereAnyNotes)
  const filehandler = useSelector(selectFileHandler)
  const search = useSelector(selectSearch)
  const filterbg = useColorModeValue('green.100', 'green.900')
  const [isDesktop] = useMediaQuery('(min-width: 768px)')
  const filename = useSelector(selectFileName)

  useEffect(() => {
    if (!isThereAnyNotes) {
      toast({ title: 'You do not have any notes', status: 'warning' })
      navigate('/')
    }
  }, [isThereAnyNotes, toast, navigate])

  return (
    <>
      <Flex direction="row-reverse">
        <Box display="flex" flexDirection="column" flex={1} height={fullHeight} overflow="auto">
          <Heading
            as="h2"
            position="sticky"
            zIndex="2"
            top="0"
            alignItems="center"
            bg={useColorModeValue('whiteAlpha.500', 'blackAlpha.100')}
            backdropFilter="blur(2px)"
            gap={2}
            display="flex"
          >
            <span>📓 </span>
            {currentUser ? filename || 'Untitled.txt' : 'Notes'}
            {filehandler ? <Icon as={FiZap} fontSize={20} /> : <Icon as={FiZapOff} fontSize={20} />}
          </Heading>
          {search && (
            <Box bg={filterbg} color="green.500" textAlign="center" mb={3} mt={3}>
              Filtered
            </Box>
          )}
          {isDesktop ? <DesktopTable /> : <MobileTable />}
        </Box>
        {isDesktop ? <FilterBar /> : null}
      </Flex>
    </>
  )
}

export default memo(Home)
