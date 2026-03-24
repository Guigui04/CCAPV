import { type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, MessageSquare, ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils'

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/news', label: 'Articles', icon: FileText },
  { to: '/admin/feedback', label: 'Feedbacks', icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function isActive(to: string) {
    return to === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(to)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-slate-900 text-white flex-col fixed inset-y-0 left-0 z-30">
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
            const Icon = n.icon
            const active = isActive(n.to)
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                  active
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon size={18} />
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
            <ArrowLeft size={16} />
            Site public
          </Link>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-slate-800"
          >
            <LogOut size={16} />
            Deconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden bg-slate-900 text-white sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div>
            <span className="font-display font-bold text-sm">Info Jeunes</span>
            <span className="text-slate-400 text-xs ml-2 uppercase tracking-wider font-semibold">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-t border-slate-200">
        <div className="flex items-center justify-around h-16">
          {ADMIN_NAV.map((n) => {
            const Icon = n.icon
            const active = isActive(n.to)
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors',
                  active
                    ? 'text-indigo-600'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-xl transition-colors',
                    active ? 'bg-indigo-50' : ''
                  )}
                >
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-bold">{n.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Content */}
      <div className="lg:ml-60 pb-24 lg:pb-8 p-4 lg:p-8 overflow-auto">{children}</div>
    </div>
  )
}
