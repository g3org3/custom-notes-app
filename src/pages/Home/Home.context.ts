import React from 'react'

interface Props {
  globalOpen: boolean
}

export default React.createContext<Props>({ globalOpen: false })
