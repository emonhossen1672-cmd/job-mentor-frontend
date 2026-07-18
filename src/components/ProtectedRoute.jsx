import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return <LoadingSpinner text="লোড হচ্ছে..." />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
