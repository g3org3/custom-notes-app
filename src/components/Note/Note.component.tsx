import Editor from "@monaco-editor/react";
import { useState, useEffect, useContext } from 'react'
import Typography from '@mui/material/Typography'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Redirect } from '@reach/router'
import yaml from 'js-yaml'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import RootContext from 'pages/Root/Root.context'
import CheckboxList from 'components/CheckboxList'
import { dateToISO } from 'services/date'
import { capitalize } from 'services/string'
import { actions } from 'modules/Note'
import { selectNoteById } from 'modules/Note/Note.selectors'
import NoteHeader from './components/NoteHeader'
import Code from './components/Code'

interface Props {
  path?: string
  id?: string
}

const Note = (props: Props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { keyCombo, setKeyCombo, lastKeyDatetime, isDarkTheme } = useContext(RootContext)
  const [isMode, setIsMode] = useState<string | null>(null)
  const note = useSelector(selectNoteById(props.id))
  const theme = isDarkTheme ? atomOneDark : atomOneLight

  useEffect(() => {
    const diff = new Date().getTime() - lastKeyDatetime
    if (keyCombo === 'q-q' && diff < 100) {
      navigate('/')
    }
  }, [keyCombo, setKeyCombo, navigate, lastKeyDatetime])

  if (!note) {
    return <Redirect to="/" />
  }

  const { date, subject, notes, next_steps, tags, doubts, time } = note
  const lxdate = dateToISO(date)

  const onCloseClick = () => navigate('/')


  const onNextStepClick = (index: number) => {
    dispatch(
      actions.toggleNextStep({
        noteId: note.id,
        nextStepIndex: index,
      })
    )
  }

  const onDoubtClick = (index: number) => {
    dispatch(
      actions.toggleDoubt({
        noteId: note.id,
        doubtIndex: index,
      })
    )
  }

  if (isMode === 'editor') {
    const yamlversionstr = '---\n' + yaml.dump(note, {
      replacer: (_, value) => {
        if (value.date instanceof Date) {
          return {
            ...value,
            date: dateToISO(value.date)
          }
        }
        return value
      }
    }) + '\n'

    return <NoteHeader
      note={note}
      onCloseClick={onCloseClick}
      onSourceClick={() => setIsMode('source')}
      onEditClick={() => setIsMode(null)}
      isMode={isMode}
    >
      <Typography
        sx={{ fontSize: 20, display: 'inline-block' }}
        color="text.primary"
        gutterBottom
      >
        {subject || 'No Subject'}
      </Typography>
      <Editor
        height="90vh" // By default, it fully fits with its parent
        theme="light"
        language={"yaml"}
        value={yamlversionstr}
        loading={`Loading...`}
      />
    </NoteHeader>
  }

  if (isMode === 'source') {
    const yamlversionstr = '---\n' + yaml.dump(note, {
      replacer: (_, value) => {
        if (value.date instanceof Date) {
          return {
            ...value,
            date: dateToISO(value.date)
          }
        }
        return value
      }
    }) + '\n'

    return (
      <NoteHeader
        note={note}
        onCloseClick={onCloseClick}
        onSourceClick={() => setIsMode(null)}
        onEditClick={() => setIsMode('editor')}
        isMode={isMode}
      >
        <Typography
          sx={{ fontSize: 20, display: 'inline-block' }}
          color="text.primary"
          gutterBottom
        >
          {subject || 'No Subject'}
        </Typography>
        <SyntaxHighlighter language="yaml" style={theme}>
          {yamlversionstr}
        </SyntaxHighlighter>
      </NoteHeader>
    )
  }

  return (
    <NoteHeader
      note={note}
      onCloseClick={onCloseClick}
      onSourceClick={() => setIsMode('source')}
      onEditClick={() => setIsMode('editor')}
      isMode={isMode}
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
            <span key={tag}>
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
          <CheckboxList
            items={next_steps.map((label) => ({ label }))}
            onItemClick={onNextStepClick}
          />
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
          <CheckboxList items={doubts.map((label) => ({ label }))} onItemClick={onDoubtClick} />
        </>
      )}
    </NoteHeader>
  )
}

export default Note
