import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface CommuneGuardProps {
  children: ReactNode
}

/**
 * Redirects authenticated users who haven't selected a commune yet
 * to the commune selection page. Non-authenticated users pass through
 * (public pages are accessible without login).
 * super_admin is exempt — they manage all communes.
 */
export default function CommuneGuard({ children }: CommuneGuardProps) {
  const { needsCommuneSelection } = useAuth()

  if (needsCommuneSelection) {
    return <Navigate to="/select-commune" replace />
  }

  return <>{children}</>
}
