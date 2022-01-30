import { Badge, Button, Flex, Heading, Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react'
import { DateTime } from 'luxon'
// @ts-ignore
import QRScan from 'qrscan'
import { FC, useEffect, useState } from 'react'
import { IOSView } from 'react-device-detect'

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

  return (
    <Flex direction="column" alignItems="center">
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
      <Table size="sm">
        <Thead>
          <Tr>
            <Td>IP</Td>
            <Td>Status</Td>
            <Td>Country</Td>
            <Td>Browser</Td>
            <Td>OS</Td>
            <Td>Updated At</Td>
            <Td>Duration</Td>
            <Td></Td>
          </Tr>
        </Thead>
        <Tbody>
          {auths.map((auth) => (
            <Tr>
              <Td>{auth.ip}</Td>
              <Td>
                <Badge colorScheme={auth.connected ? 'green' : 'red'}>
                  {auth.connected ? 'online' : 'offline'}
                </Badge>
              </Td>
              <Td>{auth.ipdata.country}</Td>
              <Td>{auth.fingerprint.browserName}</Td>
              <Td>{auth.fingerprint.osName}</Td>
              <Td>{DateTime.fromISO(auth.updatedAt).toRelative()}</Td>
              <Td>{DateTime.fromISO(auth.createdAt).toRelative()}</Td>
              <Td>
                {auth.fingerprintId === fingerprintId ? (
                  'current session'
                ) : (
                  <Button
                    onClick={onClickForceLogout(auth.fingerprintId, auth.forceLogout)}
                    size="xs"
                    colorScheme="red"
                  >
                    {auth.forceLogout ? 'unblock machine' : 'force logout'}
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  )
}

export default ReadQr
