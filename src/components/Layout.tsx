import { type ReactNode, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Bell, Bookmark, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Accueil' },
  { path: '/explorer', icon: Search, label: 'Explorer' },
  { path: '/alertes', icon: Bell, label: 'Alertes' },
  { path: '/favoris', icon: Bookmark, label: 'Favoris' },
  { path: '/profil', icon: User, label: 'Profil' },
]

export default function Layout({ children }: LayoutProps) {
  const { isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const tabs = [...NAV_ITEMS]
  if (isAdmin) {
    tabs.splice(3, 0, { path: '/admin', icon: LayoutDashboard, label: 'Admin' })
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-4 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-200">
            IJ
          </div>
          <span className="font-display font-bold text-slate-900 tracking-tight text-sm">
            Info Jeunes
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-4 py-2.5 z-50 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive =
              tab.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(tab.path)
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  'flex flex-col items-center gap-0.5 transition-all duration-200 min-w-[3.5rem]',
                  isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                <div
                  className={cn(
                    'p-1.5 rounded-xl transition-colors',
                    isActive ? 'bg-indigo-50' : 'bg-transparent'
                  )}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
