// @ts-ignore
import styled from 'styled-components'
import Paper from '@mui/material/Paper'

export const StyledCard = styled(Paper)`
  display: flex;
  min-width: 275;
  padding: 4px 10px 4px 4px;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-radius: 0;
  cursor: pointer;
  margin: 0;
  transition: background 300ms;

  :hover {
    background: #f6f6f6;
  }
`
