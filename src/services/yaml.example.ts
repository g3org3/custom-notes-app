export const exampleNotesYaml = `--- 
subject: Big meeting
date: 2021-10-14T18:00:00+01:00
people: [Bob, Mike]
notes: we talk about bla bla
tags: [tech, note-taking]
doubts:
- how to write multiline notes?
ns:
- (done) finish my homework
- (done:2022-01-02T12:00:00+01:00) finish the new song
---
subject: dashboard design
date: 2021-10-15
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
- (done:2022-01-02T16:00:00) create the wire-frame
- (done) dj mix
---
subject: merge?
next_steps:
- create the wire-frame (owner robert)  
---
subject: another one
date: 2021-11-01
tags: [notes, tech]
next_steps:
- create UX links (owner robert)
`
