import { Button, Flex, Heading, useColorModeValue, useToast } from '@chakra-ui/react'
import { useNavigate } from '@reach/router'
import base64 from 'base-64'
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth'
import { DateTime } from 'luxon'
import { FC, useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'
import UAParser from 'ua-parser-js'
import * as uuid from 'uuid'

import GenQrCode from 'components/GenQrCode'
import { useAuth } from 'config/auth'
import { dbSet } from 'config/firebase'

interface Props {
  path?: string
}

const Login: FC<Props> = (props) => {
  const btnBackground = useColorModeValue('gray.200', 'blue.800')
  const toast = useToast()
  const navigate = useNavigate()
  const { currentUser, loginWithGoogle, setSessionId } = useAuth()

  useEffect(() => {
    const fn = async () => {
      if (!currentUser || !currentUser.email) return

      if (currentUser.providerData.length === 1) {
        const credential = EmailAuthProvider.credential(currentUser.email, currentUser.uid)
        linkWithCredential(currentUser, credential)
      }

      let ip = 'unknown'
      let ipdata = 'unknown'
      try {
        const res = await fetch('https://ipinfo.io?token=9d1708faa861f9', {
          headers: { accept: 'application/json' },
        })
        const data = await res.json()
        if (data.ip) {
          ip = data.ip
          ipdata = data
        }
      } catch {}

      const ua = window?.navigator?.userAgent
      const parser = new UAParser()
      const { browser, device, engine, os, cpu } = parser.getResult()
      const fingerprint = {
        browserName: browser.name ? browser.name : null,
        browserVersion: browser.version ? browser.version : null,
        cpu: cpu.architecture ? cpu.architecture : null,
        deviceModel: device.model ? device.model : null,
        deviceVendor: device.vendor ? device.vendor : null,
        deviceType: device.type ? device.type : null,
        engineName: engine.name ? engine.name : null,
        osName: os.name ? os.name : null,
        osVersion: os.version ? os.version : null,
        screenHeight: window.screen.height,
        screenWidth: window.screen.width,
        screenPixelDepth: window.screen.pixelDepth,
      }
      const str = Object.values(fingerprint).join('')
      const fingerprintId = base64.encode(str)
      const id = uuid.v4()
      const payload = {
        ip,
        ipdata,
        fingerprint,
        fingerprintId,
        uuid: id,
        ua: ua || 'unknown',
        connected: true,
        createdAt: DateTime.now().toISO(),
        updatedAt: DateTime.now().toISO(),
      }
      dbSet(`auth/${currentUser.uid}`, fingerprintId, payload)
      setSessionId(fingerprintId)

      navigate('/')
    }
    fn()
    // eslint-disable-next-line
  }, [currentUser])

  const handleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (err) {
      toast({
        title: 'Error to login',
        // @ts-ignore
        description: err.message,
        status: 'error',
      })
    }
  }

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" gap={4}>
      <Heading>Login</Heading>
      <Flex direction="column" gap={2} minWidth={{ base: '', md: '400px' }}>
        <Button leftIcon={<FcGoogle />} onClick={handleLogin} bg={btnBackground}>
          Log in
        </Button>
      </Flex>
      <GenQrCode />
    </Flex>
  )
}

export default Login
