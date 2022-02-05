import { Badge, Button, Flex, Heading, Table, Tbody, Td, Thead, Tr } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { FC, useEffect, useState } from 'react'

import { dbOnValue, dbSet } from 'config/firebase'
import { useAuth } from 'lib/auth'
import { FingerPrint, getFingerPrint, IpInfo } from 'lib/fingerprint'

interface Props {
  default?: boolean
  path?: string
}

interface Auth {
  connected: boolean
  ip: string
  ipdata?: IpInfo
  fingerprint: FingerPrint
  fingerprintId: string
  uuid: string
  ua: string
  createdAt: string
  updatedAt: string
  forceLogout?: boolean
}

const AuthLog: FC<Props> = (props) => {
  const [auths, setAuths] = useState<Array<Auth>>([])
  const { currentUser } = useAuth()
  const { fingerprintId } = getFingerPrint()

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

  return (
    <Flex direction="column" p={4}>
      <Heading>Login audit log</Heading>
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
            <Tr key={auth.fingerprintId}>
              <Td>{auth.ip}</Td>
              <Td>
                <Badge colorScheme={auth.connected ? 'green' : 'red'}>
                  {auth.connected ? 'online' : 'offline'}
                </Badge>
              </Td>
              <Td>{auth.ipdata?.country}</Td>
              <Td>{auth.fingerprint?.browserName}</Td>
              <Td>{auth.fingerprint?.osName}</Td>
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

export default AuthLog
