import { useColorMode, useColorModeValue, IconButton, IconButtonProps } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { FC } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>

const ColorModeSwitcher: FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue('dark', 'light')
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <motion.div
        style={{ display: 'inline-block' }}
        key={useColorModeValue('light', 'dark')}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          size="md"
          fontSize="lg"
          variant="ghost"
          color="white"
          _hover={{ background: 'whiteAlpha.300' }}
          _active={{ background: 'whiteAlpha.500' }}
          marginLeft="2"
          onClick={toggleColorMode}
          icon={<SwitchIcon />}
          aria-label={`Switch to ${text} mode`}
          {...props}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default ColorModeSwitcher
