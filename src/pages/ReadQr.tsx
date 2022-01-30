import { Button, Flex, Heading } from '@chakra-ui/react'
// @ts-ignore
import QRScan from 'qrscan'
import { FC, useEffect, useState } from 'react'
import { ImQrcode } from 'react-icons/im'

import { useAuth } from 'config/auth'
import { dbOnValue, dbSet } from 'config/firebase'
import { FingerPrint, getFingerPrint, IpInfo } from 'services/fingerprint'

interface Props {
  default?: boolean
  path?: string
}

interface Auth {
  connected: boolean
  ip: string
  ipdata: IpInfo
  fingerprint: FingerPrint
  fingerprintId: string
  uuid: string
  ua: string
  createdAt: string
  updatedAt: string
  forceLogout?: boolean
}

const ReadQr: FC<Props> = (props) => {
  const [auths, setAuths] = useState<Array<Auth>>([])
  const [go, setGo] = useState(false)
  const [val, setVal] = useState(null)
  const { currentUser } = useAuth()
  const { fingerprintId } = getFingerPrint()

  const onFind = (value: any) => {
    setVal(value)
    setGo(false)
  }

  const onClickForceLogout = (id: string, forceLogout?: boolean) => () => {
    if (!currentUser) return
    dbSet(`auth/${currentUser.uid}/${id}`, 'forceLogout', !forceLogout)
  }

  useEffect(() => {
    if (!currentUser) return
    dbOnValue(`auth/${currentUser.uid}`, (snapshot) => {
      const val = snapshot.val() as { [f: string]: Auth }
      setAuths(Object.values(val))
    })
  }, [currentUser])

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
