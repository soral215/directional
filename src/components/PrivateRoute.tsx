import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores'

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

