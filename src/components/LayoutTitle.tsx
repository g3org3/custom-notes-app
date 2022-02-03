import { Heading, Link } from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { FC } from 'react'
import { FiX } from 'react-icons/fi'

interface Props {
  userDisplayName?: string | null
  homeUrl?: string
  title: string
  by?: string
}

const LayoutTitle: FC<Props> = ({ title, userDisplayName, homeUrl, by }) => {
  return (
    <Link
      as={ReachLink}
      to={homeUrl || '/'}
      _hover={{ background: 'whiteAlpha.300' }}
      _active={{ background: 'whiteAlpha.500' }}
      padding={2}
      borderRadius="lg"
    >
      <Heading as="h1" size="md" display="flex" alignItems="center" color="white">
        {title}{' '}
        {by ? (
          <>
            <FiX size={13} />
            {userDisplayName || by}
          </>
        ) : null}
      </Heading>
    </Link>
  )
}

export default LayoutTitle
