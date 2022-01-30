import { Link } from '@chakra-ui/react'
import { Link as ReachLink } from '@reach/router'
import { FC, ReactNode } from 'react'

interface Props {
  path?: string | null
  children: ReactNode
}

const ConditionalLink: FC<Props> = ({ path, children }) =>
  path ? (
    <Link as={ReachLink} to={path}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  )

export default ConditionalLink
