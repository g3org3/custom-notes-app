import { createContext } from 'react'

interface RootContextProps {
  appVersion: string
  isDarkTheme: boolean
  notesYaml: string | null
  setIsDarkTheme: (isDark: boolean) => void
  setNotesYaml: (text: string | null) => void
}

const initialContextValue = {
  appVersion: '-2',
  isDarkTheme: false,
  notesYaml: null,
  setIsDarkTheme: () => {},
  setNotesYaml: () => {},
}

export default createContext<RootContextProps>(initialContextValue)
