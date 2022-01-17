import { Router } from '@reach/router'
import { useSelector } from 'react-redux'

import Layout from 'components/Layout'
import Empty from 'pages/Empty'
import Home from 'pages/Home'
import NoteId from 'pages/NoteId'
import Export from 'pages/Export'
import Login from 'pages/Login'
import { selectIsThereAnyNotes } from 'modules/Note/Note.selectors'

const menuItems = [
  { path: '/notes', label: 'Notes', icon: '📓', command: '1' },
  { path: '/export', label: 'Export', icon: '📦', command: '2' },
  // { path: '/next-steps', label: 'Next Steps', icon: '🥞' },
]

const Routes = () => {
  const isThereAnyNotes = useSelector(selectIsThereAnyNotes)

  const menu = isThereAnyNotes ? menuItems : undefined

  return (
    <Router>
      <Layout
        title="Notes"
        by="Jorge Adolfo"
        homeUrl="/notes"
        menuItems={menu}
        path="/"
      >
        <Home path="/notes" />
        <NoteId path="/notes/:noteId" />
        <Export path="/export" />
        <Login path="/login" />
        <Empty default />
      </Layout>
    </Router>
  )
}

export default Routes
