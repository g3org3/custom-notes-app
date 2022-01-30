import {
  Box,
  Flex,
  Grid,
  Heading,
  Link,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Link as ReachLink, useNavigate } from '@reach/router'
import base64 from 'base-64'
import { AnimatePresence } from 'framer-motion'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { FiX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

import ColorModeSwitcher from 'components/ColorModeSwitcher'
import LayoutMenu, { MenuOption } from 'components/LayoutMenu'
import NewNoteModal from 'components/NewNoteModal'
import { useAuth } from 'config/auth'
import { dbOnValue, dbSet } from 'config/firebase'
import { actions } from 'modules/Note'
import {
  selectFileHandler,
  selectFileName,
  selectIsThereAnyNotes,
  selectNotes,
} from 'modules/Note/Note.selectors'
import { getFileName, openAndSaveToFile, saveToFile } from 'services/file'
import { getFingerPrint } from 'services/fingerprint'
import { notesToYaml } from 'services/notes'

interface Props {
  title: string
  homeUrl?: string
  by?: string
  childrend?: React.ReactNode
  path?: string
  menuOptions?: Array<MenuOption>
}

const Layout: React.FC<Props> = ({ homeUrl, children, title, by, menuOptions }) => {
  const navigate = useNavigate()
  const toast = useToast()
  const dispatch = useDispatch()
  const { currentUser, logout } = useAuth()
  const navbarBackgroundColor = useColorModeValue('teal.500', 'teal.500')
  const fileHandler = useSelector(selectFileHandler)
  const storeFileName = useSelector(selectFileName)
  const notes = useSelector(selectNotes)
  const isAnyNotes = useSelector(selectIsThereAnyNotes)
  const pagePadding = { base: '10px', md: '20px 40px' }
  const isAuthenticated = !!currentUser
  const { fingerprintId } = getFingerPrint()

  useEffect(() => {
    if (!currentUser) return
    dbSet(`auth/${currentUser.uid}/${fingerprintId}`, 'connected', true)
    dbSet(`auth/${currentUser.uid}/${fingerprintId}`, 'updatedAt', DateTime.now().toISO())
    // eslint-disable-next-line
  }, [currentUser])

  const { isOpen: newNoteIsOpen, onOpen: newNoteOnOpen, onClose: newNoteOnClose } = useDisclosure()
  useHotkeys(
    'n',
    (e) => {
      e.preventDefault()
      newNoteOnOpen()
    },
    [newNoteOnOpen]
  )

  const onClickReset = useCallback(() => {
    dispatch(actions.reset())
  }, [dispatch])

  const onClickAuth = useCallback(async () => {
    if (currentUser) {
      dispatch(actions.reset())
      await logout()
    }
    navigate('/login')
  }, [logout, currentUser, navigate, dispatch])

  useEffect(() => {
    if (!currentUser) return

    dbOnValue(`auth/${currentUser.uid}/${fingerprintId}/forceLogout`, (snapshot) => {
      const val = snapshot.val()
      if (val) {
        onClickAuth()
      }
    })
    // eslint-disable-next-line
  }, [currentUser])

  const saveNotesToFile = (event: any) => {
    if (event && event.preventDefault && typeof event.preventDefault === 'function') {
      event.preventDefault()
    }

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

  // @ts-ignore
  const isMac = !!window.navigator?.userAgentData === 'macOS'
  const superIcon = isMac ? '⌘+' : 'ctrl+'
  const authenticatedMenuOptions = isAuthenticated
    ? [
        { onClick: newNoteOnOpen, label: 'New Note', emoji: ':memo:', command: 'N' },
        { onClick: saveNotesToFile, label: 'Save All', emoji: ':floppy_disk:', command: superIcon + 'S' },
      ]
    : []

  return (
    <>
      <NewNoteModal isOpen={newNoteIsOpen} onClose={newNoteOnClose} />
      <Grid minH="100vh">
        <Box
          alignItems="center"
          bg={navbarBackgroundColor}
          boxShadow="md"
          display="flex"
          gap="10px"
          height="48px"
          padding={pagePadding}
          position="fixed"
          top="0"
          width="100vw"
          zIndex="3"
        >
          <LayoutMenu
            authenticatedMenuOptions={authenticatedMenuOptions}
            avatarUrl={currentUser?.photoURL}
            isAuthenticated={isAuthenticated}
            isStateEmpty={!isAnyNotes}
            menuOptions={menuOptions}
            onClickAuth={onClickAuth}
            onClickReset={onClickReset}
            userDisplayName={currentUser?.displayName}
          />
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
