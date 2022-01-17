import yaml from 'js-yaml'
import { createFTS } from 'services/full-text-search'
import type { NoteDBType } from 'modules/Note'
import { DateTime } from 'luxon'

export const notesToYaml = (notes: Array<NoteDBType> | null): string => {
  if (!notes) return ''

  const options = {
    // sortKeys: true,
    noArrayIndent: true,
    noCompatMode: true,
    lineWidth: -1,
    // replacer: (_: string, value: NoteDBType) => {
    //   if (value && value.date instanceof Date) {
    //     return {
    //       ...value,
    //       date: dateToISO(value.date),
    //     }
    //   }
    //   return value
    // },
  }

  const text = yaml.dump(
    notes.map((n) => ({
      subject: n.subject || null,
      id: null,
      emoji: n.emoji || null,
      date: n.date ? n.date.toLocal().toJSDate() : null,
      tags: n.tags || null,
      people: n.people || null,
      notes: n.notes || null,
      doubts: n.doubts || null,
      next_steps: n.next_steps || null,
    })),
    options
  )

  return text
}

export const isLineDone = (line?: string): boolean => {
  if (!line) return false

  return line.indexOf('(done) ') !== -1 || line.indexOf('(done:20') !== -1
}

export const completedList = (list?: Array<string> | null): boolean => {
  if (!list) return false

  const done = list.map((x) => isLineDone(x)).filter(Boolean).length

  return done === list.length
}

export const countDone = (list?: Array<string> | null): string => {
  if (!list) return ''

  const done = list.map((x) => isLineDone(x)).filter(Boolean).length

  return `${done} / ${list.length}`
}

export const cleanLine = (line?: string) => {
  if (!line) return ''

  return isLineDone(line) ? line.split(')')[1] : line
}

export const toggleLineDone = (
  note: NoteDBType,
  index: number,
  listName: string
): NoteDBType => {
  // @ts-ignore
  if (!note[listName]) return note

  // @ts-ignore
  const line = note[listName][index]
  const isDone = isLineDone(line)

  if (!isDone) {
    const today = DateTime.now().toISO()
    // @ts-ignore
    note[listName][index] = `(done:${today}) ` + line
  } else {
    if (line.indexOf('(done)') === 0) {
      // @ts-ignore
      note[listName][index] = line.split('(done) ').join('')
    } else {
      const closeParenIndex = line.indexOf(') ')
      // @ts-ignore
      note[listName][index] = line.substr(closeParenIndex + 2)
    }
  }

  return note
}

export const toggleNextStepDone = (
  note: NoteDBType,
  index: number
): NoteDBType => toggleLineDone(note, index, 'next_steps')

export const toggleDoubtDone = (note: NoteDBType, index: number): NoteDBType =>
  toggleLineDone(note, index, 'doubts')

export const getNextStepsStats = (note: NoteDBType): Array<number> => {
  if (!note.next_steps) return []

  const doneCount = note.next_steps?.reduce((doneCount, nextStep) => {
    return isLineDone(nextStep) ? doneCount + 1 : doneCount
  }, 0)

  return [doneCount, note.next_steps?.length]
}

export const searchNotes = (
  search: string,
  notes: Array<NoteDBType> | null
): Array<NoteDBType> => {
  if (!notes) return []
  if (!search || search.trim() === '') return notes

  const fts = createFTS(search)

  const isInAnyFields = (note: NoteDBType) => {
    let blobOfText = ''

    if (!!note.notes) {
      blobOfText += ' ' + note.notes
    }
    if (!!note.people) {
      blobOfText += ' ' + note.people.join(' ')
    }
    if (!!note.subject) {
      blobOfText += ' ' + note.subject
    }
    if (!!note.tags) {
      blobOfText += ' ' + note.tags.join(' ')
    }
    if (!!note.doubts) {
      blobOfText += ' ' + note.doubts.join(' ')
    }
    if (!!note.next_steps) {
      blobOfText += ' ' + note.next_steps.join(' ')
    }

    return fts(blobOfText)
  }

  const notesMatchedQuery = notes.filter((note) => isInAnyFields(note))

  return notesMatchedQuery
}
