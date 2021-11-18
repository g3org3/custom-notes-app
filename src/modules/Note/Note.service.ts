import yaml from 'js-yaml'

import { NoteDBType } from "."

export const notesToYaml = (notes: Array<NoteDBType> | null) => {
    if (!notes) return ''

    const options =  {
      // sortKeys: true,
      noArrayIndent: true,
    }
    
    const text = notes.map((note) => yaml.dump(note, options)).join('---\n')
    
    return `---
${text}
`

}

