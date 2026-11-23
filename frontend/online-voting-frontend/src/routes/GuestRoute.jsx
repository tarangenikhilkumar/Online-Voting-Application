import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLE_HOME } from '../utils/constants'

function GuestRoute() {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    const from = location.state?.from?.pathname
    return <Navigate to={from || ROLE_HOME[role] || '/'} replace />
  }

  return <Outlet />
}

export default GuestRoute