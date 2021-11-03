import React from 'react'

interface Props {
  globalOpen: boolean
}

const HomeContext = React.createContext<Props>({ globalOpen: false })

export default HomeContext
