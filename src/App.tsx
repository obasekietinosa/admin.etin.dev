import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/useAuth'

const navLinkBaseClasses =
  'rounded-lg px-3 py-2 font-medium text-slate-200 transition-colors duration-150 hover:bg-white/10 hover:text-slate-100'

const App = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `${navLinkBaseClasses} bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30`
      : navLinkBaseClasses

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 bg-slate-900/90 px-6 py-5 backdrop-blur-xl sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4">
            <span className="text-lg font-semibold uppercase tracking-[0.15em] text-slate-100">admin.etin.dev</span>
            <button
              type="button"
              onClick={handleToggleMenu}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:hidden"
              aria-expanded={isMenuOpen}
              aria-controls="primary-navigation"
            >
              <span className="sr-only">Toggle navigation</span>
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div
            id="primary-navigation"
            className={`${isMenuOpen ? 'flex' : 'hidden'} flex-col gap-4 sm:flex sm:flex-row sm:items-center sm:justify-end sm:gap-3`}
          >
            <nav className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3" aria-label="Primary navigation">
              <NavLink to="/" end className={getLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/companies" className={getLinkClass}>
                Companies
              </NavLink>
              <NavLink to="/roles" className={getLinkClass}>
                Roles
              </NavLink>
              <NavLink to="/notes" className={getLinkClass}>
                Notes
              </NavLink>
              <NavLink to="/tags" className={getLinkClass}>
                Tags
              </NavLink>
              <NavLink to="/projects" className={getLinkClass}>
                Projects
              </NavLink>
              <NavLink to="/about" className={getLinkClass}>
                About
              </NavLink>
            </nav>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>
      <main className="flex flex-1 justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default App
