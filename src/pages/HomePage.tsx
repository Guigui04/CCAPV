import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPublishedNews, CATEGORIES } from '../lib/newsService'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [articles, setArticles] = useState<any[]>([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPublishedNews({ category, limit: 20 })
      .then(({ data }) => setArticles(data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category])

  const featured = articles.slice(0, 3)
  const cat = (id: string) => CATEGORIES.find(c => c.id === id)

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xs">CC</span>
          </div>
          <span className="font-black text-slate-900 text-sm">Info Jeunes</span>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin" className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">Admin</Link>
          )}
          {user
            ? <button onClick={() => { logout(); navigate('/') }} className="text-xs font-bold text-slate-500">Déconnexion</button>
            : <Link to="/login" className="text-xs font-bold text-indigo-600">Connexion</Link>
          }
        </div>
      </header>

      <div className="px-4 space-y-8 mt-4">
        {/* À la une */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">À la une</h2>
            <button className="text-indigo-600 text-sm font-bold uppercase tracking-wider">Voir tout</button>
          </div>
          {loading ? (
            <div className="h-48 bg-slate-200 rounded-3xl animate-pulse" />
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-2 snap-x scrollbar-hide">
              {featured.length === 0 ? (
                <div className="min-w-full h-48 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-medium">Aucune actualité à la une</div>
              ) : featured.map(a => (
                <Link key={a.id} to={`/news/${a.id}`} className="min-w-[280px] snap-center relative rounded-3xl overflow-hidden h-48 flex-shrink-0 block">
                  {a.image_url
                    ? <img src={a.image_url} alt={a.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-5xl">{cat(a.category)?.icon}</div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-2 inline-block">Info</span>
                    <h3 className="text-white font-black text-base leading-tight">{a.title}</h3>
                    <p className="text-white/70 text-xs mt-1">📅 {new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Catégories */}
        <section>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">Catégories</h2>
          <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(category === c.id ? '' : c.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all ${
                  category === c.id
                    ? 'bg-indigo-600 scale-105 shadow-indigo-200'
                    : 'bg-white'
                }`}>
                  {c.icon}
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide text-center leading-tight">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Dernières infos */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {category ? cat(category)?.label : 'Dernières infos'}
            </h2>
          </div>
          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl animate-pulse" />)}</div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-400 font-medium">Aucune information trouvée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {articles.map(a => (
                <Link key={a.id} to={`/news/${a.id}`} className="relative rounded-3xl overflow-hidden h-48 block group">
                  {a.image_url
                    ? <img src={a.image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-6xl">{cat(a.category)?.icon}</div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-2 inline-block">Info</span>
                    <h3 className="text-white font-black text-lg leading-tight">{a.title}</h3>
                    <p className="text-white/70 text-xs mt-1">📅 {new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="absolute bottom-5 right-5 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-around">
        {[
          { icon: '🏠', label: 'Accueil', to: '/', active: true },
          { icon: '🔍', label: 'Explorer', to: '/', active: false },
          { icon: '🔔', label: 'Alertes', to: '/', active: false },
          { icon: '👤', label: 'Profil', to: user ? '/' : '/login', active: false },
        ].map(item => (
          <Link key={item.label} to={item.to} className="flex flex-col items-center gap-1">
            <span className={`text-xl ${item.active ? 'opacity-100' : 'opacity-40'}`}>{item.icon}</span>
            <span className={`text-xs font-bold ${item.active ? 'text-indigo-600' : 'text-slate-400'}`}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
