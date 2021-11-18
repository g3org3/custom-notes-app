import { createContext } from 'react'

interface RootContextProps {
  appVersion: string
  isDarkTheme: boolean
  setIsDarkTheme: (isDark: boolean) => void
  keyCombo: string
}

const initialContextValue = {
  appVersion: '-2',
  isDarkTheme: false,
  setIsDarkTheme: () => {},
  keyCombo: ''
}

export default createContext<RootContextProps>(initialContextValue)
