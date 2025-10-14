import { NavLink, Outlet } from 'react-router-dom'

const TagsLayout = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'subnav__link subnav__link--active' : 'subnav__link'

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h1>Tags</h1>
          <p className="page-header__subtitle">
            Manage discovery tags that power navigation, curation, and thematic groupings on etin.dev.
          </p>
        </div>
      </header>
      <nav className="subnav" aria-label="Tag navigation">
        <NavLink end to="." className={getLinkClass}>
          Overview
        </NavLink>
        <NavLink to="new" className={getLinkClass}>
          New tag
        </NavLink>
      </nav>
      <Outlet />
    </section>
  )
}

export default TagsLayout
