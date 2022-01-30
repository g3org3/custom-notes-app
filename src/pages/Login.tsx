import { Button, Flex, Heading, useColorModeValue, useToast } from '@chakra-ui/react'
import { useNavigate } from '@reach/router'
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth'
import { FC, useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'

import GenQrCode from 'components/GenQrCode'
import { useAuth } from 'config/auth'

interface Props {
  path?: string
}

const Login: FC<Props> = (props) => {
  const btnBackground = useColorModeValue('gray.200', 'blue.800')
  const toast = useToast()
  const navigate = useNavigate()
  const { currentUser, loginWithGoogle } = useAuth()

  useEffect(() => {
    if (!currentUser || !currentUser.email) return

    if (currentUser.providerData.length === 1) {
      const credential = EmailAuthProvider.credential(currentUser.email, currentUser.uid)
      linkWithCredential(currentUser, credential)
    }
    navigate('/')
    // eslint-disable-next-line
  }, [currentUser])

  const handleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (err) {
      toast({
        title: 'Error to login',
        // @ts-ignore
        description: err.message,
        status: 'error',
      })
    }
  }

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" gap={4}>
      <Heading>Login</Heading>
      <Flex direction="column" gap={2} minWidth={{ base: '', md: '400px' }}>
        <Button leftIcon={<FcGoogle />} onClick={handleLogin} bg={btnBackground}>
          Log in
        </Button>
      </Flex>
      <GenQrCode />
    </Flex>
  )
}

export default Login
