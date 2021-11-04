// @ts-ignore
import styled from 'styled-components'
import Card from '@mui/material/Card'

export const StyledCard = styled(Card)`
  display: flex;
  min-width: 275;
  padding: 4px 10px 4px 4px;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-radius: 0;
  cursor: pointer;
  transition: background 300ms;
  :hover {
    background: #eee;
  }
`
