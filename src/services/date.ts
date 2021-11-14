import { DateTime } from 'luxon'

export const dateToISO = (date?: Date) => {
  if (!date) return null

  return DateTime.fromJSDate(date).toISODate()
}

export const dateToPretty = (date?: Date) => {
  if (!date) return null

  return DateTime.fromJSDate(date).toFormat('ccc LLL dd')
}

export const toRelativeCalendar = (date?: Date | null) => {
  if (!date) return null

  return DateTime.fromJSDate(date).toRelativeCalendar()
}
