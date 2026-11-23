import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLE_HOME } from '../utils/constants'

function RoleRoute({ allowedRoles }) {
  const { role } = useAuth()

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role] || '/login'} replace />
  }

  return <Outlet />
}

export default RoleRoute