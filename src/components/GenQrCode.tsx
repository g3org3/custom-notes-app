import { Button, Flex } from '@chakra-ui/react'
// @ts-ignore
import QRCode from 'qrcode.react'
import { FC, useEffect, useState } from 'react'
import * as uuid from 'uuid'

import { useAuth } from 'config/auth'
import { dbOnValue, dbRemove, dbSet } from 'config/firebase'

interface Props {
  //
}

const GenQrCode: FC<Props> = (props) => {
  const [authQr, setAuthQr] = useState<string | null>(null)
  const { login } = useAuth()

  useEffect(() => {
    if (!authQr) return
    dbOnValue(`public/${authQr}`, (snapshot) => {
      const val: any = snapshot.val()
      if (val.currentUser) {
        const currentUser = val.currentUser as { email: string; uid: string }
        login(currentUser.email, currentUser.uid)
        dbRemove(`public/${authQr}`)
      }
    })
    // eslint-disable-next-line
  }, [authQr])

  const onClick = async () => {
    const id = uuid.v4()
    const payload = {
      id,
      currentUser: null,
    }
    dbSet('/public', id, payload)
    setAuthQr(id)
  }

  return (
    <Flex direction="column">
      {!authQr ? (
        <Button onClick={onClick} colorScheme="gray">
          Authenticate with QR Code
        </Button>
      ) : (
        <Flex padding={2} bg="white">
          <QRCode value={authQr} />
        </Flex>
      )}
    </Flex>
  )
}

export default GenQrCode
