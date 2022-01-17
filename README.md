# custom-notes-app

```ts
export interface NoteType {
  date?: ISO DATE YYYY-MM-DDTHH:mm:ss.z
  emoji?: string
  people?: Array<string>
  subject?: string
  notes?: string
  next_steps?: Array<string>
  tags?: Array<string>
  doubts?: Array<string>
}
```

```yml
date: 2021-11-01T18:00:00+01:00
people:
  - Bob
  - Kevin
subject: Bla bla
```
