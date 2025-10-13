import { NavLink, Outlet } from 'react-router-dom'
import {
  panelClassName,
  sectionHeadingClassName,
  sectionSubheadingClassName,
} from '../ui'

const navLinkBaseClasses =
  'flex-1 rounded-xl px-4 py-2 text-center text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white'

const RolesLayout = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `${navLinkBaseClasses} bg-gradient-to-r from-blue-500/80 to-violet-500/80 text-white shadow-lg shadow-blue-500/20`
      : navLinkBaseClasses

  return (
    <section className="space-y-8">
      <header className={`${panelClassName} space-y-3`}>
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
            Experience
          </p>
          <h1 className={sectionHeadingClassName}>Roles</h1>
          <p className={sectionSubheadingClassName}>
            Curate professional experience entries displayed on etin.dev.
          </p>
        </div>
      </header>
      <nav
        className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-900/40 p-2 text-sm"
        aria-label="Role navigation"
      >
        <NavLink end to="." className={getLinkClass}>
          Overview
        </NavLink>
        <NavLink to="new" className={getLinkClass}>
          New role
        </NavLink>
      </nav>
      <Outlet />
    </section>
  )
}

export default RolesLayout
