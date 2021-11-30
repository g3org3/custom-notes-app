import yaml from 'js-yaml'

import { dateToISO } from 'services/date'
import { NoteDBType } from "."

export const notesToYaml = (notes: Array<NoteDBType> | null) => {
    if (!notes) return ''

    const options =  {
      // sortKeys: true,
      noArrayIndent: true,
      replacer: (_: string, value: NoteDBType) => {
        if (value && value.date instanceof Date) {
          return {
            ...value,
            date: dateToISO(value.date)
          }
        }
        return value
      }
    }
    
    const text = notes.map((note) => yaml.dump(note, options)).join('---\n')
    
    return `---
${text}
`

}

