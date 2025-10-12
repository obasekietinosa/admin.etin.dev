import { NavLink, Outlet } from 'react-router-dom'

const CompaniesLayout = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'subnav__link subnav__link--active' : 'subnav__link'

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h1>Companies</h1>
          <p className="page-header__subtitle">
            Create, review, and maintain partner companies showcased on etin.dev.
          </p>
        </div>
      </header>
      <nav className="subnav" aria-label="Company navigation">
        <NavLink end to="." className={getLinkClass}>
          Overview
        </NavLink>
        <NavLink to="new" className={getLinkClass}>
          New company
        </NavLink>
      </nav>
      <Outlet />
    </section>
  )
}

export default CompaniesLayout
