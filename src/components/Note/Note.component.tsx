import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
// @ts-ignore
import yaml from 'js-yaml'

import CheckboxList from 'components/CheckboxList'
import { dateToISO } from 'services/date'
import { capitalize } from 'services/string'
import Pre from 'components/Pre'
import NoteHeader from './components/NoteHeader'
import Code from './components/Code'

export interface NoteType {
  date?: Date
  people?: Array<string>
  subject?: string
  notes?: string
  next_steps?: Array<string>
  tags?: Array<string>
  doubts?: Array<string>
  time?: string
}
interface Props {
  note: NoteType
  onCloseClick: () => void
}

const Note = (props: Props) => {
  const { onCloseClick } = props
  const { date, subject, notes, next_steps, tags, doubts, time } = props.note
  const [isSourceDisplayed, setIsSourceDisplayed] = useState(false)
  const lxdate = dateToISO(date)

  if (isSourceDisplayed) {
    const yamlversionstr = '---\n' + yaml.dump(props.note) + '\n'

    return (
      <NoteHeader
        note={props.note}
        onCloseClick={onCloseClick}
        onSourceClick={() => setIsSourceDisplayed(false)}
        isSourceDisplayed={isSourceDisplayed}
      >
        <Typography
          sx={{ fontSize: 20, display: 'inline-block' }}
          color="text.primary"
          gutterBottom
        >
          {subject || 'No Subject'}
        </Typography>
        <Pre>{yamlversionstr}</Pre>
      </NoteHeader>
    )
  }

  return (
    <NoteHeader
      note={props.note}
      onCloseClick={onCloseClick}
      onSourceClick={() => setIsSourceDisplayed(true)}
      isSourceDisplayed={isSourceDisplayed}
    >
      {subject && (
        <Typography
          sx={{ fontSize: 30, display: 'inline-block' }}
          color="text.primary"
          gutterBottom
        >
          {capitalize(subject) || 'No Subject'}
        </Typography>
      )}
      <Typography
        sx={{ fontSize: 16, display: 'inline-block', margin: '0 10px' }}
        color="text.secondary"
        gutterBottom
      >
        {lxdate} {time}
      </Typography>

      {tags && (
        <>
          {tags.map((tag) => (
            <span>
              <Typography
                style={{
                  fontSize: 14,
                  display: 'inline-block',
                  marginRight: '10px',
                }}
              >
                <b>
                  <i>#{tag}</i>
                </b>
              </Typography>
            </span>
          ))}
        </>
      )}
      <Code data={notes} />
      {/*<Code isArray data={next_steps} label="Next Steps" />*/}
      {next_steps && (
        <>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 'bold',
              marginTop: '20px',
            }}
          >
            Next Steps:
          </Typography>
          <CheckboxList items={next_steps} />
        </>
      )}
      {doubts && (
        <>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 'bold',
              marginTop: '20px',
            }}
          >
            Doubts:
          </Typography>
          <CheckboxList items={doubts} />
        </>
      )}
    </NoteHeader>
  )
}

export default Note
