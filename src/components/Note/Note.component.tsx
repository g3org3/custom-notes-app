import React, { useEffect, useState, useContext } from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// @ts-ignore
import yaml from 'js-yaml'
// @ts-ignore
import { DateTime } from 'luxon'

import CheckboxList from '../../components/CheckboxList'
import { HomeContext } from '../../pages/Home'

interface CodeProps {
  data: any
  isArray?: boolean
  label: string
}

const Code = ({ isArray, data, label }: CodeProps) =>
  (isArray && !!data && data.length > 0) || (!isArray && !!data) ? (
    <div style={{ marginTop: '20px' }}>
      <b>{label}:</b>

      {isArray ? (
        <pre style={{ border: '1px solid #ccc', padding: '10px' }}>
          {isArray ? JSON.stringify(data, null, 2) : data}
        </pre>
      ) : (
        <div style={{border: "1px solid #ccc", padding: '4px'}}>
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

  const lxdate = date ? DateTime.fromJSDate(date) : null
  const [open, setOpen] = useState(false)
  const [yamlVersion, setYV] = useState(false)

  useEffect(() => {
    setOpen(globalOpen)
  }, [globalOpen])

  if (!open) {
    return (
      <>
        <Card
          sx={{ minWidth: 275, padding: '2px', margin: '4px' }}
          onClick={() => setOpen(true)}
        >
          <Chip
            label=""
            size="small"
            sx={{ marginRight: '10px', display: 'inline-block' }}
            onClick={() => setOpen(true)}
          />
          <Typography
            sx={{ fontSize: 20, display: 'inline-block' }}
            color="text.primary"
          >
            {subject || 'No Subject'}
          </Typography>
          <Typography
            sx={{ fontSize: 16, display: 'inline-block', marginLeft: '10px' }}
            color="text.secondary"
          >
            {lxdate && lxdate.toISODate()} {time}
          </Typography>
          <Typography
            sx={{ fontSize: 16, display: 'inline-block', marginLeft: '10px' }}
            color="text.primary"
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
        </Card>
      </>
    )
  }

  if (yamlVersion) {
    const yamlversionstr = yaml.dump(props)

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
            <span onClick={() => setYV(!yamlVersion)}>yaml{'  '}</span>
            <Typography
              sx={{ fontSize: 20, display: 'inline-block' }}
              color="text.primary"
              gutterBottom
            >
              {subject || 'No Subject'}
            </Typography>
            <pre>{yamlversionstr}</pre>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Chip
            label="X"
            size="small"
            sx={{ marginRight: '10px' }}
            onClick={() => setOpen(false)}
          />
          <span onClick={() => setYV(!yamlVersion)}>(source){'  '}</span>
          <hr />
          <Typography
            sx={{ fontSize: 20, display: 'inline-block' }}
            color="text.primary"
            gutterBottom
          >
            {subject || 'No Subject'}
          </Typography>
          <Typography
            sx={{ fontSize: 16, display: 'inline-block', marginLeft: '10px' }}
            color="text.secondary"
            gutterBottom
          >
            {lxdate && lxdate.toISODate()} {time}
          </Typography>
          <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
            {people &&
              people.map((people) => (
                <Chip
                  label={people}
                  size="small"
                  sx={{ marginRight: '10px' }}
                />
              ))}
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
          <Code isArray data={tasks} label="Tasks" />
          <Code isArray data={doubts} label="Questions" />
        </CardContent>
      </Card>
      <br />
    </>
  )
}

export default Note
