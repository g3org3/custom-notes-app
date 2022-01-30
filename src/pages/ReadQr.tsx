import { Button, Flex, Heading } from '@chakra-ui/react'
// @ts-ignore
import QRScan from 'qrscan'
import { FC, useEffect, useState } from 'react'
import { IOSView } from 'react-device-detect'

import { useAuth } from 'config/auth'
import { dbSet } from 'config/firebase'

interface Props {
  default?: boolean
  path?: string
}

const ReadQr: FC<Props> = (props) => {
  const [go, setGo] = useState(false)
  const [val, setVal] = useState(null)
  const { currentUser } = useAuth()

  const onFind = (value: any) => {
    setVal(value)
    setGo(false)
  }

  useEffect(() => {
    if (!val || !currentUser) return

    const payload = {
      email: currentUser.email,
      uid: currentUser.uid,
    }
    dbSet('/public/' + val, 'currentUser', payload)
    // eslint-disable-next-line
  }, [val])

  return (
    <Flex direction="column" justifyContent="center">
      <Heading>Authenticate with QR</Heading>
      <IOSView>
        {go ? (
          <Flex height="300px">
            <QRScan onFind={onFind} />
          </Flex>
        ) : (
          <Button onClick={() => setGo(true)}>Login with QR Code</Button>
        )}
      </IOSView>
    </Flex>
  )
}

export default ReadQr
