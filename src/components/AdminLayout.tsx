import { type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/news', label: 'Articles', icon: '📝' },
  { to: '/admin/feedback', label: 'Feedbacks', icon: '💬' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-slate-700/50">
          <Link to="/" className="font-display font-bold text-sm text-white">
            Info Jeunes
          </Link>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-semibold">
            Administration
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {ADMIN_NAV.map((n) => {
            const isActive =
              n.to === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(n.to)
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-base">{n.icon}</span>
                {n.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-slate-700/50 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800"
          >
            ← Site public
          </Link>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-slate-800"
          >
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 ml-60 p-8 overflow-auto">{children}</div>
    </div>
  )
}
