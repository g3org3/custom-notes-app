import React from 'react'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'

import { Search, SearchIconWrapper, StyledInputBase } from './Navbar.style'

interface Props {
  areNotesOpen: boolean
  onGlobalOpenClick: (event: React.MouseEventHandler<HTMLInputElement>) => void
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  search: string
  resetState: () => void
}

const Navbar = (props: Props) => {
  const {
    areNotesOpen,
    onSearchChange,
    search,
    onGlobalOpenClick,
    resetState,
  } = props

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Container sx={{ display: 'flex' }}>
            <Typography onClick={resetState} variant="h6" component="div">
              Notes
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={onSearchChange}
                value={search}
              />
            </Search>
            {/*@ts-ignore*/}
            <Button color="inherit" onClick={onGlobalOpenClick}>
              {areNotesOpen ? 'collapse' : 'open'}
            </Button>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
