import { DateTime } from 'luxon'

export const dateToISO = (date?: DateTime | null) => {
  if (!date) return null

  return date.toISO()
}

export const dateToPretty = (date?: DateTime | null) => {
  if (!date) return 'Some day'

  if (date instanceof DateTime) return date.toFormat('LLLL cccc dd')

  return date
}

export const dateToPrettyTime = (date?: DateTime | null) => {
  if (!date) return null

  const utc = date.toUTC()
  const time = utc.hour + utc.minute + utc.millisecond

  if (time) return date.toFormat('hh:mm a')

  return ''
}

export const toRelativeCalendar = (date?: DateTime | null) => {
  if (!date) return null

  return date.toRelativeCalendar()
}
