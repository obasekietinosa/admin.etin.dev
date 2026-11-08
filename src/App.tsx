import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Building2,
  FileText,
  FolderKanban,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Tag,
  X,
} from 'lucide-react'
import { useAuth } from './auth/useAuth'

const navLinkBaseClasses =
  'inline-flex items-center gap-2 rounded-sm border px-3 py-2 font-mono text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-150'

const App = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `${navLinkBaseClasses} border-bronze bg-bronze/15 text-bronze-light shadow-[inset_0_0_12px_rgba(200,138,50,0.15)]`
      : `${navLinkBaseClasses} border-transparent text-muted hover:border-border hover:bg-surface hover:text-foreground`

  const getBottomTabClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-1 flex-col items-center justify-center gap-1 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] transition-colors ${
      isActive
        ? 'text-bronze-light'
        : 'text-muted hover:text-foreground'
    }`

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

  const isSecondaryRouteActive =
    location.pathname.startsWith('/companies') ||
    location.pathname.startsWith('/tags') ||
    location.pathname.startsWith('/about')

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-[#0E0C0A]/95 px-4 py-3.5 backdrop-blur-md sm:px-8 sm:py-4">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-wider text-foreground transition hover:text-bronze-light"
            >
              <span className="text-xs text-bronze" aria-hidden="true">
                ◆
              </span>
              <span>admin.etin.dev</span>
            </Link>
            <button
              type="button"
              onClick={handleToggleMenu}
              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-sm border border-border bg-card p-2 text-foreground transition hover:border-bronze/60 hover:text-bronze-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze lg:hidden"
              aria-expanded={isMenuOpen}
              aria-controls="primary-navigation"
            >
              <span className="sr-only">Toggle navigation</span>
              {isMenuOpen ? (
                <X className="h-5 w-5 text-bronze-light" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          <div
            id="primary-navigation"
            className={`${
              isMenuOpen ? 'flex' : 'hidden'
            } flex-col gap-3 border-t border-border-inner pt-3 lg:flex lg:flex-row lg:items-center lg:justify-end lg:gap-2 lg:border-0 lg:pt-0`}
          >
            <nav
              className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-row lg:items-center lg:gap-1.5"
              aria-label="Primary navigation"
            >
              <NavLink to="/" end className={getLinkClass}>
                <LayoutDashboard className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/notes" className={getLinkClass}>
                <FileText className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
                <span>Notes</span>
              </NavLink>
              <NavLink to="/projects" className={getLinkClass}>
                <FolderKanban className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
                <span>Projects</span>
              </NavLink>
              <NavLink to="/roles" className={getLinkClass}>
                <Briefcase className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
                <span>Roles</span>
              </NavLink>
              <NavLink to="/companies" className={getLinkClass}>
                <Building2 className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
                <span>Companies</span>
              </NavLink>
              <NavLink to="/tags" className={getLinkClass}>
                <Tag className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
                <span>Tags</span>
              </NavLink>
              <NavLink to="/about" className={getLinkClass}>
                <Info className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
                <span>About</span>
              </NavLink>
            </nav>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-sm border border-border bg-surface px-3.5 py-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted transition hover:border-coral/60 hover:bg-coral-surface hover:text-coral-light disabled:cursor-not-allowed disabled:opacity-60 lg:ml-2"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isSigningOut ? 'Signing out…' : 'Sign out'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 justify-center px-3.5 pb-24 pt-5 sm:px-8 sm:py-10 lg:pb-12">
        <div className="w-full max-w-5xl">
          <Outlet />
        </div>
      </main>

      {/* Thumb-friendly mobile bottom navigation bar */}
      <nav
        aria-label="Mobile quick navigation"
        className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border bg-[#0E0C0A]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <NavLink to="/" end className={getBottomTabClass}>
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/notes" className={getBottomTabClass}>
          <FileText className="h-4 w-4" aria-hidden="true" />
          <span>Notes</span>
        </NavLink>
        <NavLink to="/projects" className={getBottomTabClass}>
          <FolderKanban className="h-4 w-4" aria-hidden="true" />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/roles" className={getBottomTabClass}>
          <Briefcase className="h-4 w-4" aria-hidden="true" />
          <span>Roles</span>
        </NavLink>
        <button
          type="button"
          onClick={handleToggleMenu}
          aria-expanded={isMenuOpen}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] transition-colors ${
            isMenuOpen || isSecondaryRouteActive
              ? 'text-bronze-light'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {isMenuOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
          <span>More</span>
        </button>
      </nav>
    </div>
  )
}

export default App

