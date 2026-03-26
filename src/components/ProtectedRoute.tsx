import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireSuperAdmin = false,
}: {
  children: React.ReactNode
  requireAdmin?: boolean
  requireSuperAdmin?: boolean
}) {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (requireSuperAdmin && !isSuperAdmin) return <Navigate to="/" replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}
