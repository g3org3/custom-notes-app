import { Flex, useDisclosure } from '@chakra-ui/react'
import { useNavigate } from '@reach/router'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ColorModeSwitcher from 'components/ColorModeSwitcher'
import Global from 'components/Global'
import LayoutMenu, { MenuOption } from 'components/LayoutMenu'
import LayoutTitle from 'components/LayoutTitle'
import { useSave } from 'hooks/note'
import { useAuth } from 'lib/auth'
import { actions } from 'modules/Note'
import { selectIsThereAnyNotes } from 'modules/Note/Note.selectors'

interface Props {
  title: string
  homeUrl?: string
  by?: string
  childrend?: React.ReactNode
  path?: string
  menuOptions?: Array<MenuOption>
}

export const nav = {
  h: 48,
  px: { base: 10, md: 10 },
  py: { base: 10, md: 20 },
}
const navPadding = {
  base: nav.py.base + 'px ' + nav.px.base + 'px',
  md: `${nav.py.md}px ${nav.px.md}px`,
}
export const body = {
  px: { base: nav.px.base, md: nav.px.md },
  py: { base: nav.px.base, md: nav.py.md },
}
const bodyPadding = {
  base: `${nav.h + body.py.base}px ${body.px.base}px ${body.py.base}px`,
  md: `${nav.h + body.py.md}px ${body.px.md}px ${body.py.md}px`,
}
export const fullHeight = {
  base: `calc(100vh - ${nav.h + body.py.base * 2}px)`,
  md: `calc(100vh - ${nav.h + body.py.md * 2}px)`,
}
export const fullWidth = {
  base: `calc(100vw - ${body.px.base * 2}px)`,
  md: `calc(100vw - ${body.px.md * 2}px)`,
}

const Layout: React.FC<Props> = ({ homeUrl, children, title, by, menuOptions }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentUser, logout } = useAuth()
  const isAnyNotes = useSelector(selectIsThereAnyNotes)
  const isAuthenticated = !!currentUser
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { saveNotesToFile } = useSave()

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

  // @ts-ignore
  const isMac = !!window.navigator?.userAgentData === 'macOS'
  const superIcon = isMac ? '⌘+' : 'ctrl+'

  const authenticatedMenuOptions = isAuthenticated
    ? [
        { onClick: onOpen, label: 'New Note', emoji: ':memo:', command: 'N' },
        { onClick: saveNotesToFile, label: 'Save All', emoji: ':floppy_disk:', command: superIcon + 'S' },
      ]
    : []

  return (
    <>
      <Global
        onClickAuth={onClickAuth}
        isOpenNewNote={isOpen}
        onCloseNewNote={onClose}
        onOpenNewNote={onOpen}
      />
      <Flex
        alignItems="center"
        bg="teal.700"
        boxShadow="lg"
        height={`${nav.h}px`}
        lef="0"
        padding={navPadding}
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
          <LayoutTitle userDisplayName={currentUser?.displayName} title={title} homeUrl={homeUrl} by={by} />
        </Flex>
        <Flex flexGrow={{ base: '0', md: '1' }} gap={3} justify="flex-end" alignItems="center">
          <ColorModeSwitcher />
        </Flex>
      </Flex>
      <Flex padding={bodyPadding} direction="column" minH="100vh">
        {children}
      </Flex>
    </>
  )
}

export default Layout
