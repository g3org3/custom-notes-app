export const exampleNotesYaml = `# example notes
---
id: asdfA123232
date: 2021-10-14
subject: Big meeting
people: [Bob, Mike]
notes: we talk about bla bla
doubts:
- how to write multiline notes?

---
date: 2021-10-15
subject: dashboard design
people:
- bob
- rachel
notes: |
  with the pipe then you are able to 
  write multiline notes

  and everything will be considered as a string

  ### markdown syntax
  
  | name        | version |
  |-------------|---------|
  | note-taking | 1.2.3   |

next_steps:
- create the wire-frame
- (done) dj mix

---
subject: merge?
next_steps:
- create the wire-frame
  `
