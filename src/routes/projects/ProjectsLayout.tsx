import { NavLink, Outlet } from 'react-router-dom'

const ProjectsLayout = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'subnav__link subnav__link--active' : 'subnav__link'

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="page-header__subtitle">
            Manage the case studies and portfolio entries highlighted on etin.dev.
          </p>
        </div>
      </header>
      <nav className="subnav" aria-label="Project navigation">
        <NavLink end to="." className={getLinkClass}>
          Overview
        </NavLink>
        <NavLink to="new" className={getLinkClass}>
          New project
        </NavLink>
      </nav>
      <Outlet />
    </section>
  )
}

export default ProjectsLayout
