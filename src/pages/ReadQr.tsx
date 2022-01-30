import { Button, Flex, Heading } from '@chakra-ui/react'
// @ts-ignore
import QRScan from 'qrscan'
import { FC, useEffect, useState } from 'react'
import { ImQrcode } from 'react-icons/im'

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
    setTimeout(() => {
      window.location.reload()
    }, 3000)
    // eslint-disable-next-line
  }, [val])

  if (go) {
    return <QRScan onFind={onFind} />
  }

  return (
    <Flex direction="column" alignItems="center" gap={4}>
      <Heading>Authenticate with QR</Heading>
      <Button size="lg" leftIcon={<ImQrcode />} onClick={() => setGo(true)}>
        Scan QR Code
      </Button>
    </Flex>
  )
}

export default ReadQr
