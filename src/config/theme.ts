import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const components = {
  Link: {
    baseStyle: (props: any) => ({
      color: mode('black', 'white')(props),
      _hover: {
        color: mode('black', 'white')(props),
      },
      _focus: {
        boxShadow: 'none',
        textDecoration: 'underline',
      },
    }),
  },
  Button: {
    baseStyle: (props: any) => ({
      _focus: {
        boxShadow: 'none',
        textDecoration: 'underline',
      },
    }),
  },
}
const config = {
  useSystemColorMode: true,
}

const theme = extendTheme({
  components,
  config,
})

export default theme
