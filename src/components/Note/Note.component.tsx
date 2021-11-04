import React, { useEffect, useState, useContext } from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
// @ts-ignore
import yaml from 'js-yaml'

import CheckboxList from '../../components/CheckboxList'
import SimpleNote from '../../components/SimpleNote'
import { HomeContext } from '../../pages/Home'
import { dateToISO } from '../../services/date'
import { capitalize } from '../../services/string'
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
interface Props extends NoteType {}

const Note = (props: Props) => {
  const { globalOpen } = useContext(HomeContext)
  const { date, subject, notes, next_steps, tags, doubts, time } = props

  const [isOpen, setIsOpen] = useState(false)
  const [isSourceDisplayed, setIsSourceDisplayed] = useState(false)
  const lxdate = dateToISO(date)

  useEffect(() => {
    setIsOpen(globalOpen)
  }, [globalOpen])

  if (!isOpen) {
    return <SimpleNote note={props} onClick={() => setIsOpen(true)} />
  }

  if (isSourceDisplayed) {
    const yamlversionstr = '---\n' + yaml.dump(props) + '\n'

    return (
      <NoteHeader
        note={props}
        onCloseClick={() => setIsOpen(false)}
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
        <pre style={{ border: '1px solid #ccc', background: '#f8f8f8' }}>
          {yamlversionstr}
        </pre>
      </NoteHeader>
    )
  }

  return (
    <NoteHeader
      note={props}
      onCloseClick={() => setIsOpen(false)}
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
      <Code data={notes} label="Notes" />
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
