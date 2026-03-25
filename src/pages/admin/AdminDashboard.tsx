import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/AdminLayout'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, pending: 0, total_feedbacks: 0, alerts: 0, users: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [articlesRes, pendingRes, totalFbRes, alertsRes, usersRes] = await Promise.all([
          supabase.from('news').select('*', { count: 'exact', head: true }),
          supabase
            .from('feedback')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'new'),
          supabase.from('feedback').select('*', { count: 'exact', head: true }),
          supabase.from('notifications').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
        ])
        setStats({
          articles: articlesRes.count ?? 0,
          pending: pendingRes.count ?? 0,
          total_feedbacks: totalFbRes.count ?? 0,
          alerts: alertsRes.count ?? 0,
          users: usersRes.count ?? 0,
        })
      } catch (err) {
        console.error('Error loading stats:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    {
      label: 'Articles publiés',
      value: stats.articles,
      icon: '📝',
      to: '/admin/news',
      color: 'from-indigo-50 to-blue-50 border-indigo-100',
    },
    {
      label: 'Feedbacks en attente',
      value: stats.pending,
      icon: '⏳',
      to: '/admin/feedback',
      color: 'from-amber-50 to-orange-50 border-amber-100',
    },
    {
      label: 'Feedbacks total',
      value: stats.total_feedbacks,
      icon: '💬',
      to: '/admin/feedback',
      color: 'from-emerald-50 to-teal-50 border-emerald-100',
    },
    {
      label: 'Alertes envoyées',
      value: stats.alerts,
      icon: '📢',
      to: '/admin/alerts',
      color: 'from-purple-50 to-fuchsia-50 border-purple-100',
    },
    {
      label: 'Utilisateurs',
      value: stats.users,
      icon: '👥',
      to: '/admin/users',
      color: 'from-sky-50 to-cyan-50 border-sky-100',
    },
  ]

  return (
    <AdminLayout>
      <h2 className="font-display font-bold text-xl lg:text-2xl text-slate-900 mb-6 lg:mb-8">
        Tableau de bord
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {cards.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className={`bg-gradient-to-br ${c.color} border rounded-2xl p-5 lg:p-6 hover:shadow-md transition-shadow group`}
              >
                <div className="text-2xl mb-3">{c.icon}</div>
                <p className="text-3xl font-display font-bold text-slate-900">
                  {c.value}
                </p>
                <p className="text-sm text-slate-500 mt-1 group-hover:text-slate-700 transition-colors">
                  {c.label}
                </p>
              </Link>
            ))}
          </div>

          <h3 className="font-display font-bold text-lg text-slate-900 mb-4">
            Actions rapides
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/admin/news"
              className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">📝</span>
              <div>
                <p className="font-semibold text-slate-900">Gérer les articles</p>
                <p className="text-xs text-slate-400">Créer, modifier, publier</p>
              </div>
            </Link>
            <Link
              to="/admin/feedback"
              className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-semibold text-slate-900">Modérer les feedbacks</p>
                <p className="text-xs text-slate-400">
                  Approuver, rejeter, supprimer
                </p>
              </div>
            </Link>
            <Link
              to="/admin/alerts"
              className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">📢</span>
              <div>
                <p className="font-semibold text-slate-900">Envoyer une alerte</p>
                <p className="text-xs text-slate-400">
                  Notifier les jeunes
                </p>
              </div>
            </Link>
            <Link
              to="/admin/users"
              className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-semibold text-slate-900">Gérer les utilisateurs</p>
                <p className="text-xs text-slate-400">
                  Voir les profils, modifier les rôles
                </p>
              </div>
            </Link>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
