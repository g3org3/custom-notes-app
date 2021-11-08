import { createContext } from 'react'

interface RootContextProps {
  appVersion: string
  isDarkTheme: boolean
  setIsDarkTheme: (isDark: boolean) => void
}

const initialContextValue = {
  appVersion: '-2',
  isDarkTheme: false,
  setIsDarkTheme: () => {},
}

export default createContext<RootContextProps>(initialContextValue)
