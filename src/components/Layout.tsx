import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Link as ReachLink, useNavigate } from '@reach/router'
import base64 from 'base-64'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { FiX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

import ColorModeSwitcher from 'components/ColorModeSwitcher'
import NewNoteModal from 'components/NewNoteModal'
import { useAuth } from 'config/auth'
import { dbSet } from 'config/firebase'
import { actions } from 'modules/Note'
import {
  selectFileHandler,
  selectFileName,
  selectIsThereAnyNotes,
  selectNotes,
} from 'modules/Note/Note.selectors'
import { getFileName, openAndSaveToFile, saveToFile } from 'services/file'
import { notesToYaml } from 'services/notes'

interface Props {
  title: string
  homeUrl?: string
  by?: string
  childrend?: React.ReactNode
  path?: string
  menuItems?: Array<{
    path: string
    label: string
    icon: string
    command: string
  }>
}

const Layout: React.FC<Props> = ({ homeUrl, children, title, by, menuItems }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const dispatch = useDispatch()
  const { currentUser, logout } = useAuth()
  const navbarBackgroundColor = useColorModeValue('teal.500', 'teal.500')
  const dividerColor = useColorModeValue('gray.200', 'gray.700')
  const fileHandler = useSelector(selectFileHandler)
  const storeFileName = useSelector(selectFileName)
  const notes = useSelector(selectNotes)
  const isAnyNotes = useSelector(selectIsThereAnyNotes)
  const pagePadding = { base: '10px', md: '20px 40px' }

  const { isOpen: newNoteIsOpen, onOpen: newNoteOnOpen, onClose: newNoteOnClose } = useDisclosure()
  useHotkeys(
    'n',
    (e) => {
      e.preventDefault()
      newNoteOnOpen()
    },
    [newNoteOnOpen]
  )

  const handleReset = useCallback(() => {
    dispatch(actions.reset())
  }, [dispatch])

  const handleAuth = useCallback(() => {
    if (currentUser) {
      logout()
    } else {
      navigate('/login')
    }
  }, [logout, currentUser, navigate])

  const saveNotesToFile = (event: Event) => {
    event.preventDefault()

    if (!notes || notes.length === 0) {
      toast({ title: 'There are no notes to save', status: 'error' })

      return
    }

    if (currentUser && storeFileName) {
      const { uid, displayName, email } = currentUser
      const name64 = base64.encode(storeFileName)
      const payload = {
        id: name64,
        name: storeFileName,
        notes: notes.map((n) => ({
          ...n,
          date: n.date ? n.date.toISO() : null,
        })),
      }
      dbSet(`/users/${uid}/notes`, name64, payload)
      dbSet(`/users/${uid}`, 'displayName', displayName)
      dbSet(`/users/${uid}`, 'email', email)
      dbSet(`/users/${uid}`, 'id', uid)
    }

    const notesInYaml = notesToYaml(notes)

    if (!fileHandler) {
      openAndSaveToFile(notesInYaml)
        .then((fh) => {
          dispatch(actions.setFileHandler({ fileHandler: fh }))
          const fileName = getFileName(fh)
          dispatch(actions.setFileName({ fileName }))
          toast({ title: 'Saved', status: 'success' })
        })
        .catch((err) => {
          toast({
            title: 'Error to save file',
            description: err.message,
            status: 'error',
          })
        })

      return
    }

    saveToFile(fileHandler, notesInYaml)
      .then(() => {
        toast({ title: 'Saved', status: 'success' })
      })
      .catch((err) => {
        toast({
          title: 'Error to save file',
          description: err.message,
          status: 'error',
        })
      })
  }

  useHotkeys('command+s', saveNotesToFile, [toast, notes, fileHandler, currentUser])
  useHotkeys('ctrl+s', saveNotesToFile, [toast, notes, fileHandler, currentUser])
  const { toggleColorMode } = useColorMode()
  useHotkeys('d', () => toggleColorMode(), [toggleColorMode])

  return (
    <>
      <NewNoteModal isOpen={newNoteIsOpen} onClose={newNoteOnClose} />
      <Grid minH="100vh">
        <Box
          bg={navbarBackgroundColor}
          position="fixed"
          zIndex={2}
          top="0"
          display="flex"
          width="100vw"
          height="48px"
          alignItems="center"
          gap="10px"
          boxShadow="md"
          padding={pagePadding}
        >
          <Menu>
            <MenuButton variant="ghost" as={Button}>
              <Avatar src={currentUser?.photoURL || ''} size="sm" />
            </MenuButton>
            <MenuList>
              {menuItems?.map((item) => (
                <MenuItem key={item.path}>
                  <Link as={ReachLink} to={item.path} display="flex" gap={2}>
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                </MenuItem>
              ))}
              {menuItems && <MenuDivider color={dividerColor} />}
              {currentUser && (
                // @ts-ignore
                <MenuItem onClick={newNoteOnOpen} icon={<span>📝</span>} command="N">
                  New Note
                </MenuItem>
              )}
              {isAnyNotes && currentUser && (
                <MenuItem
                  // @ts-ignore
                  onClick={saveNotesToFile}
                  icon={<span>💾</span>}
                  command="⌘S"
                >
                  Save
                </MenuItem>
              )}
              {isAnyNotes && <MenuDivider color={dividerColor} />}
              {isAnyNotes && (
                <MenuItem onClick={handleReset} display="flex" gap={2}>
                  <span>🚧</span>
                  Reset
                </MenuItem>
              )}
              {isAnyNotes && <MenuDivider color={dividerColor} />}
              <MenuItem onClick={handleAuth} display="flex" gap={2}>
                <span>🔓</span>
                {currentUser ? 'Log out' : 'Log in'}
              </MenuItem>
            </MenuList>
          </Menu>
          <Flex grow={{ base: '1', md: '0' }} justifyContent="center">
            <AnimatePresence>
              <Link as={ReachLink} to={homeUrl || '/'}>
                <Heading as="h1" size="md" display="flex" alignItems="center" color="white">
                  {title}{' '}
                  {by ? (
                    <>
                      <FiX size={13} />

                      {currentUser?.displayName || by}
                    </>
                  ) : null}
                </Heading>
              </Link>
            </AnimatePresence>
          </Flex>
          <Flex flexGrow={{ base: '0', md: '1' }} gap={3} justify="flex-end" alignItems="center">
            <ColorModeSwitcher />
          </Flex>
        </Box>
        <Flex mt="48px" padding={pagePadding} direction="column">
          {children}
        </Flex>
      </Grid>
    </>
  )
}

export default Layout
