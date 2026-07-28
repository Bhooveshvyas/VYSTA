import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner text="Authenticating..." />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  return children
}
