import { NavLink, Outlet } from 'react-router-dom'

const NotesLayout = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'subnav__link subnav__link--active' : 'subnav__link'

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h1>Notes</h1>
          <p className="page-header__subtitle">
            Capture and refine long-form writing destined for etin.dev.
          </p>
        </div>
      </header>
      <nav className="subnav" aria-label="Notes navigation">
        <NavLink end to="." className={getLinkClass}>
          Overview
        </NavLink>
        <NavLink to="new" className={getLinkClass}>
          New note
        </NavLink>
      </nav>
      <Outlet />
    </section>
  )
}

export default NotesLayout
