import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ articles: 0, pending: 0, total_feedbacks: 0 })

  useEffect(() => {
    async function load() {
      const [{ count: articles }, { count: pending }, { count: total_feedbacks }] = await Promise.all([
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('feedbacks').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('feedbacks').select('*', { count: 'exact', head: true }),
      ])
      setStats({ articles: articles ?? 0, pending: pending ?? 0, total_feedbacks: total_feedbacks ?? 0 })
    }
    load()
  }, [])

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-blue-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-blue-700">
          <Link to="/" className="font-display font-bold text-sm">CC Alpes Provence Verdon</Link>
          <p className="text-blue-400 text-xs mt-1 uppercase tracking-wide">Administration</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[{to:'/admin',label:'Dashboard',icon:'📊'},{to:'/admin/news',label:'Articles',icon:'📝'},{to:'/admin/feedback',label:'Feedbacks',icon:'💬'}].map(n => (
            <Link key={n.to} to={n.to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-200 hover:bg-blue-800 hover:text-white transition-all">{n.icon} {n.label}</Link>
          ))}
        </nav>
        <div className="p-3 border-t border-blue-700">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-blue-300 hover:text-white">← Site public</Link>
          <button onClick={() => { logout(); navigate('/') }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-300 hover:text-red-300">🚪 Déconnexion</button>
        </div>
      </aside>
      <div className="flex-1 p-8">
        <h2 className="font-display font-bold text-2xl text-blue-900 mb-8">Tableau de bord</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[{label:'Articles',value:stats.articles,icon:'📝',to:'/admin/news'},{label:'Feedbacks en attente',value:stats.pending,icon:'⏳',to:'/admin/feedback'},{label:'Feedbacks total',value:stats.total_feedbacks,icon:'💬',to:'/admin/feedback'}].map(c => (
            <Link key={c.label} to={c.to} className="card p-6 hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">{c.icon}</div>
              <p className="text-3xl font-display font-bold text-blue-900">{c.value}</p>
              <p className="text-sm text-slate-500 mt-1">{c.label}</p>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/admin/news" className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow"><span className="text-2xl">📝</span><div><p className="font-semibold text-blue-900">Gérer les articles</p><p className="text-xs text-slate-400">Créer, modifier, publier</p></div></Link>
          <Link to="/admin/feedback" className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow"><span className="text-2xl">💬</span><div><p className="font-semibold text-blue-900">Modérer les feedbacks</p><p className="text-xs text-slate-400">Approuver, rejeter, supprimer</p></div></Link>
        </div>
      </div>
    </div>
  )
}
