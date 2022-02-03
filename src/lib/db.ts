import { useEffect, useState } from 'react'

import { dbOnValue } from 'config/firebase'

export const useOnValue = <T>(ref: string): T | undefined | null => {
  const [val, setval] = useState<T | undefined | null>(undefined)

  useEffect(() => {
    const unsub = dbOnValue(ref, (snap) => {
      setval(snap.val())
    })

    return unsub
    // eslint-disable-next-line
  }, [])

  return val
}

export const useOnValueWithMapper = <T, G>(ref: string, mapper: (snapshot: T | null | undefined) => G): G => {
  return mapper(useOnValue<T>(ref))
}
