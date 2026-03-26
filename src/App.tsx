import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// Eagerly loaded (always needed)
import HomePage from './pages/HomePage'

// Lazy-loaded pages
const ExplorerPage = lazy(() => import('./pages/ExplorerPage'))
const AlertesPage = lazy(() => import('./pages/AlertesPage'))
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ProfilPage = lazy(() => import('./pages/ProfilPage'))
const FavorisPage = lazy(() => import('./pages/FavorisPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const CGUPage = lazy(() => import('./pages/CGUPage'))
const MentionsLegalesPage = lazy(() => import('./pages/MentionsLegalesPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminNews = lazy(() => import('./pages/admin/AdminNews'))
const AdminFeedback = lazy(() => import('./pages/admin/AdminFeedback'))
const AdminAlerts = lazy(() => import('./pages/admin/AdminAlerts'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminCommunes = lazy(() => import('./pages/admin/AdminCommunes'))
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'))

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
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

        {/* Protected pages */}
        <Route path="/profil" element={<ProtectedRoute><Layout><ProfilPage /></Layout></ProtectedRoute>} />
        <Route path="/favoris" element={<ProtectedRoute><Layout><FavorisPage /></Layout></ProtectedRoute>} />

        {/* Public info pages */}
        <Route path="/confidentialite" element={<PrivacyPage />} />
        <Route path="/cgu" element={<CGUPage />} />
        <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin pages — require admin role */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/news" element={<ProtectedRoute requireAdmin><AdminNews /></ProtectedRoute>} />
        <Route path="/admin/feedback" element={<ProtectedRoute requireAdmin><AdminFeedback /></ProtectedRoute>} />
        <Route path="/admin/alerts" element={<ProtectedRoute requireAdmin><AdminAlerts /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/communes" element={<ProtectedRoute requireSuperAdmin><AdminCommunes /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AdminAnalytics /></ProtectedRoute>} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
