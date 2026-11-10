import { Home } from './pages/Home'
import { Legal } from './pages/Legal'
import { NotFound } from './pages/NotFound'

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/privacy') return <Legal type="privacy" />
  if (path === '/terms') return <Legal type="terms" />
  if (path !== '/') return <NotFound />
  return <Home />
}
