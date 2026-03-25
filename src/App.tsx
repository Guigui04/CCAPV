import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ExplorerPage from './pages/ExplorerPage'
import AlertesPage from './pages/AlertesPage'
import ProfilPage from './pages/ProfilPage'
import NewsDetailPage from './pages/NewsDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminNews from './pages/admin/AdminNews'
import AdminFeedback from './pages/admin/AdminFeedback'
import AdminAlerts from './pages/admin/AdminAlerts'

export default function App() {
  return (
    <Routes>
      {/* Public pages with mobile layout */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/explorer" element={<Layout><ExplorerPage /></Layout>} />
      <Route path="/alertes" element={<Layout><AlertesPage /></Layout>} />
      <Route path="/news/:id" element={<Layout><NewsDetailPage /></Layout>} />

      {/* Auth pages — no layout wrapper */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected profile page */}
      <Route path="/profil" element={<ProtectedRoute><Layout><ProfilPage /></Layout></ProtectedRoute>} />

      {/* Admin pages — require admin role */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/news" element={<ProtectedRoute requireAdmin><AdminNews /></ProtectedRoute>} />
      <Route path="/admin/feedback" element={<ProtectedRoute requireAdmin><AdminFeedback /></ProtectedRoute>} />
      <Route path="/admin/alerts" element={<ProtectedRoute requireAdmin><AdminAlerts /></ProtectedRoute>} />
    </Routes>
  )
}
