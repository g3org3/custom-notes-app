import { Flex, Progress, Text } from '@chakra-ui/react'
import { Emoji } from 'emoji-mart'
import { User } from 'firebase/auth'
import { createContext, FC, ReactNode, useContext } from 'react'

import { useAuth } from 'lib/auth'

interface Props {
  path?: string
  default?: boolean
  children: ReactNode
}

// @ts-ignore
const SecuredCtx = createContext<{ currentUser: User }>({})

export const useSecuredCtx = (): { currentUser: User } => {
  const ctx = useContext(SecuredCtx)

  return ctx
}

const PrivateRoute: FC<Props> = ({ children }) => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return (
      <Flex direction="column" textAlign="center">
        <Emoji set="google" emoji=":hand:" size={32} />
        <Text fontFamily="monospace" fontSize={28}>
          Unauthorized
        </Text>
        <Progress isIndeterminate />
      </Flex>
    )
  }

  return <SecuredCtx.Provider value={{ currentUser }}>{children}</SecuredCtx.Provider>
}

export default PrivateRoute
