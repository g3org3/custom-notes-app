import { Router } from '@reach/router'
import { isIOS } from 'react-device-detect'
import { useSelector } from 'react-redux'

import Layout from 'components/Layout'
import { MenuOption } from 'components/LayoutMenu'
import { selectIsThereAnyNotes } from 'modules/Note/Note.selectors'
import AuthLog from 'pages/AuthLog'
import Empty from 'pages/Empty'
import Export from 'pages/Export'
import Home from 'pages/Home'
import Login from 'pages/Login'
import NoteId from 'pages/NoteId'
import ReadQr from 'pages/ReadQr'
import Shared from 'pages/Shared'

const menuOptions: Array<MenuOption> = [
  { path: '/notes', label: 'Notes', emoji: ':notebook:' },
  { path: '/export', label: 'Export', emoji: ':package:' },
  { path: '/shared', label: 'Shared', emoji: ':satellite:' },
  { path: '/auth-log', label: 'Login Log', emoji: ':customs:' },
]

const Routes = () => {
  const isThereAnyNotes = useSelector(selectIsThereAnyNotes)

  const menu = isThereAnyNotes ? menuOptions : undefined

  if (isIOS && menuOptions.length === 3) {
    menuOptions.push({ path: '/read-qr', label: 'Login with QR', emoji: ':camera:' })
  }

  return (
    <Router>
      <Layout title="Notes" by="Jorge Adolfo" homeUrl="/notes" menuOptions={menu} path="/">
        <Home path="/notes" />
        <Shared path="/shared" />
        <ReadQr path="/read-qr" />
        <AuthLog path="/auth-log" />
        <NoteId path="/notes/:noteId" />
        <Export path="/export" />
        <Login path="/login" />
        <Empty default />
      </Layout>
    </Router>
  )
}

export default Routes
