import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

const App = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'app__link app__link--active' : 'app__link'

  return (
    <div className="app">
      <header className="app__header">
        <span className="app__brand">admin.etin.dev</span>
        <nav className="app__nav" aria-label="Primary navigation">
          <NavLink to="/" end className={getLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/about" className={getLinkClass}>
            About
          </NavLink>
        </nav>
      </header>
      <main className="app__content">
        <Outlet />
      </main>
    </div>
  )
}

export default App
