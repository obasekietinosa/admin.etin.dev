import { NavLink, Outlet } from 'react-router-dom'

const RolesLayout = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'subnav__link subnav__link--active' : 'subnav__link'

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h1>Roles</h1>
          <p className="page-header__subtitle">
            Curate professional experience entries displayed on etin.dev.
          </p>
        </div>
      </header>
      <nav className="subnav" aria-label="Role navigation">
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
