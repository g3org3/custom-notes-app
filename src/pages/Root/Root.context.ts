import { createContext } from 'react'

interface RootContextProps {
  appVersion: string
  isDarkTheme: boolean
  setIsDarkTheme: (isDark: boolean) => void
  keyCombo: string
  setKeyCombo: (key: string) => void
  lastKeyDatetime: number
}

const initialContextValue = {
  appVersion: '-2',
  isDarkTheme: false,
  setIsDarkTheme: () => {},
  keyCombo: '',
  setKeyCombo: () => {},
  lastKeyDatetime: 0,
}

export default createContext<RootContextProps>(initialContextValue)
