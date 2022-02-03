import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

import Routes from 'config/Routes'
import theme from 'config/theme'
import { AuthProvider } from 'lib/auth'

const Root = () => {
  return (
    <>
      <ColorModeScript />
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ChakraProvider>
    </>
  )
}

export default Root
