import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/useAuth'

const navLinkBaseClasses =
  'rounded-lg px-3 py-2 font-medium text-slate-200 transition-colors duration-150 hover:bg-white/10 hover:text-slate-100'

const App = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `${navLinkBaseClasses} bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30`
      : navLinkBaseClasses

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
      <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-6 py-5 backdrop-blur-xl sm:px-8">
        <span className="text-lg font-semibold uppercase tracking-[0.15em] text-slate-100">admin.etin.dev</span>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Primary navigation">
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
