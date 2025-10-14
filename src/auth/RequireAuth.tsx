import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

const RequireAuth = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to="/login" state={{ from: redirectTo }} replace />
  }

  return <Outlet />
}

export default RequireAuth
