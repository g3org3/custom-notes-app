import base64 from 'base-64'
import UAParser from 'ua-parser-js'

export interface IpInfo {
  city: string
  country: string
  ip: string
  org: string
  hostname?: string
  loc: string
  postal: string
  region: string
  timezone: string
}

export const getIpInfo = async () => {
  let ip = 'unknown'
  let ipdata: IpInfo | null = null
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

  return { ip, ipdata }
}

export interface FingerPrint {
  browserName: string | null
  browserVersion: string | null
  cpu: string | null
  deviceModel: string | null
  deviceVendor: string | null
  deviceType: string | null
  engineName: string | null
  osName: string | null
  osVersion: string | null
  screenHeight: number
  screenWidth: number
  screenPixelDepth: number
}

export const getFingerPrint = () => {
  const parser = new UAParser()
  const { browser, device, engine, os, cpu } = parser.getResult()

  const fingerprint: FingerPrint = {
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

  return { fingerprint, fingerprintId }
}
