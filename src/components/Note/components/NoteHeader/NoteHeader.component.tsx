import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

import { capitalize } from '../../../../services/string'
import type { NoteType } from '../../Note.component'

interface Props {
  children: React.ReactNode
  isSourceDisplayed: boolean
  note: NoteType
  onCloseClick: () => void
  onSourceClick: () => void
}

const NoteHeader = (props: Props) => {
  const {
    note,
    children,
    onCloseClick,
    onSourceClick,
    isSourceDisplayed,
  } = props
  const { people } = note

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', marginRight: '10px' }}>
            <div>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onCloseClick}
                size="small"
              >
                <KeyboardBackspaceIcon />
              </Button>
            </div>
            <pre
              style={{
                cursor: 'pointer',
                display: 'inline-block',
                margin: 0,
                marginLeft: '5px',
              }}
              onClick={onSourceClick}
            >
              <Button
                variant={isSourceDisplayed ? 'contained' : 'outlined'}
                disableElevation={isSourceDisplayed}
                color="primary"
                size="small"
              >
                {'</>'}
              </Button>
            </pre>
          </div>
          <div style={{ flexGrow: 1 }}>
            <Typography
              sx={{
                fontSize: 16,
                display: 'inline-block',
                borderLeft: '1px solid #ccc',
                padding: '0 0 0 10px',
              }}
              color="text.primary"
              gutterBottom
            >
              {people &&
                people.map((people: string, id: number) => (
                  <Chip
                    key={`${id}-${people}`}
                    avatar={<Avatar>{capitalize(people).substr(0, 1)}</Avatar>}
                    color="primary"
                    variant="outlined"
                    label={capitalize(people)}
                    size="small"
                    sx={{ margin: '0 10px 10px 0' }}
                  />
                ))}
            </Typography>
          </div>
        </div>
        <hr />
        {children}
      </CardContent>
    </Card>
  )
}

export default NoteHeader
