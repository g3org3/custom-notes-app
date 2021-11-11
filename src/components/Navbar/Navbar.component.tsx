import React, { useContext } from 'react'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
// @ts-ignore
import { useNavigate } from '@reach/router'

import { Search, SearchIconWrapper, StyledInputBase } from './Navbar.style'
import RootContext from 'pages/Root/Root.context'

interface Props {
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  search: string
  onHomeClick: () => void
}

const Navbar = (props: Props) => {
  const { onSearchChange, search, onHomeClick } = props
  const { appVersion, isDarkTheme, setIsDarkTheme } = useContext(RootContext)
  const navigate = useNavigate()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <Container sx={{ display: 'flex' }}>
            <Typography onClick={onHomeClick} variant="h6" component="div">
              Notes {appVersion}
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
            <Button color="inherit" onClick={() => navigate('/next-steps')}>
              Next Steps
            </Button>
            <Button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              color="inherit"
            >
              {isDarkTheme ? 'light' : 'dark'}
            </Button>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
