import React, { useEffect, useState, useContext } from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// @ts-ignore
import yaml from 'js-yaml'

import CheckboxList from '../../components/CheckboxList'
import SimpleNote from '../../components/SimpleNote'
import { HomeContext } from '../../pages/Home'
import { dateToISO } from '../../services/date'
import { capitalize } from '../../services/string'

interface CodeProps {
  data: any
  isArray?: boolean
  label: string
}

const Code = ({ isArray, data, label }: CodeProps) => {
  const [isMarkdown, setIM] = useState(true)

  return (isArray && !!data && data.length > 0) || (!isArray && !!data) ? (
    <div style={{ marginTop: '20px' }}>
      {label}:{' '}
      <span onClick={() => setIM(!isMarkdown)} style={{ cursor: 'pointer' }}>
        {isMarkdown ? <b>(markdown)</b> : '(markdown)'}
      </span>
      {isArray || !isMarkdown ? (
        <pre
          style={{
            border: '1px solid #ccc',
            background: '#f8f8f8',
            padding: '10px',
          }}
        >
          {isArray ? JSON.stringify(data, null, 2) : data}
        </pre>
      ) : (
        <div style={{ border: '1px solid #ccc', padding: '4px' }}>
          <ReactMarkdown
            children={data}
            components={{
              table: ({ node, ...props }) => (
                <table {...props} className="table" />
              ),
            }}
            remarkPlugins={[remarkGfm]}
          />
        </div>
      )}
    </div>
  ) : null
}

export interface NoteType {
  date?: Date
  people?: Array<string>
  subject?: string
  notes?: string
  next_steps?: Array<string>
  tags?: Array<string>
  doubts?: Array<string>
  time?: string
  tasks?: Array<string>
}
interface Props extends NoteType {}

const Note = (props: Props) => {
  const { globalOpen } = useContext(HomeContext)
  const {
    date,
    people,
    subject,
    notes,
    next_steps,
    tags,
    doubts,
    time,
    tasks,
  } = props

  const [open, setOpen] = useState(false)
  const [yamlVersion, setYV] = useState(false)
  const lxdate = dateToISO(date)

  useEffect(() => {
    setOpen(globalOpen)
  }, [globalOpen])

  if (!open) {
    return <SimpleNote note={props} onClick={() => setOpen(true)} />
  }

  if (yamlVersion) {
    const yamlversionstr = '---\n' + yaml.dump(props) + '\n'

    return (
      <>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            {' '}
            <Chip
              label="X"
              size="small"
              sx={{ marginRight: '10px' }}
              onClick={() => setOpen(false)}
            />
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => setYV(!yamlVersion)}
            >
              <b>(source)</b>
            </span>
            <hr />
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
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <Card sx={{ minWidth: 275, marginTop: '20px' }}>
        <CardContent>
          <Chip
            label="X"
            size="small"
            sx={{ marginRight: '10px' }}
            onClick={() => setOpen(false)}
          />
          <span
            style={{ cursor: 'pointer', display: 'inline-block' }}
            onClick={() => setYV(!yamlVersion)}
          >
            (source){'  '}
          </span>
          <Typography
            sx={{
              fontSize: 16,
              display: 'inline-block',
              borderLeft: '1px solid #ccc',
              marginLeft: '10px',
              padding: '0 0 0 10px',
            }}
            color="text.primary"
            gutterBottom
          >
            {people &&
              people.map((people) => (
                <Chip
                  label={people}
                  size="small"
                  sx={{ marginRight: '10px' }}
                />
              ))}
          </Typography>
          <hr />
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
            sx={{ fontSize: 16, display: 'inline-block', marginLeft: '10px' }}
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
                    <i>#{tag}</i>
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
        </CardContent>
      </Card>
      <br />
    </>
  )
}

export default Note
