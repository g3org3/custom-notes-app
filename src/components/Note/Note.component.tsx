import { useState } from 'react'
import Typography from '@mui/material/Typography'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Redirect } from '@reach/router'
import yaml from 'js-yaml'

import CheckboxList from 'components/CheckboxList'
import { dateToISO } from 'services/date'
import { capitalize } from 'services/string'
import { actions } from 'modules/Note'
import Pre from 'components/Pre'
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
  const [isSourceDisplayed, setIsSourceDisplayed] = useState(false)
  const note = useSelector(selectNoteById(props.id))

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

  if (isSourceDisplayed) {
    const yamlversionstr = '---\n' + yaml.dump(note) + '\n'

    return (
      <NoteHeader
        note={note}
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
      note={note}
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
          <CheckboxList items={doubts.map((label) => ({ label }))} />
        </>
      )}
    </NoteHeader>
  )
}

export default Note
