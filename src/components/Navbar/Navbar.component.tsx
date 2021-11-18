import React, { useContext, useEffect, createRef } from 'react'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import { useNavigate } from '@reach/router'

import { Search, SearchIconWrapper, StyledInputBase } from './Navbar.style'
import RootContext from 'pages/Root/Root.context'

interface Props {
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  search: string | null
  onResetClick: () => void
}

const searchRef = createRef<HTMLInputElement>()

const Navbar = (props: Props) => {
  const { onSearchChange, search, onResetClick } = props
  const navigate = useNavigate()
  const { appVersion, isDarkTheme, setIsDarkTheme, keyCombo } = useContext(RootContext)

  useEffect(() => {
    if (searchRef.current && (keyCombo === 'Meta-k' || keyCombo === 'Control-k')) {
      searchRef.current.focus()
    }
  }, [keyCombo])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <Container sx={{ display: 'flex' }}>
            <Button onClick={() => navigate('/')} color="inherit">
              Notes {appVersion}
            </Button>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                inputRef={searchRef}
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={onSearchChange}
                value={search || ''}
              />
            </Search>
            <Button
              size="small"
              color="inherit"
              onClick={() => navigate('/next-steps')}
            >
              Next Steps
            </Button>
            <Button
              color="inherit"
              onClick={() => setIsDarkTheme(!isDarkTheme)}
            >
              {isDarkTheme ? 'light' : 'dark'}
            </Button>
            <Button color="inherit" onClick={() => navigate('/export')}>
              export
            </Button>
            <Button size="small" color="inherit" onClick={onResetClick}>
              X
            </Button>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
