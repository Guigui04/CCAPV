import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedNews, CATEGORIES } from '../lib/newsService'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const { user, isAdmin, logout } = useAuth()
  const [articles, setArticles] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const LIMIT = 12

  useEffect(() => {
    setLoading(true)
    getPublishedNews({ category, page, limit: LIMIT })
      .then(({ data, count }) => { setArticles(data ?? []); setTotal(count ?? 0) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category, page])

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-blue-900 text-lg">CC Alpes Provence Verdon</span>
          <nav className="flex items-center gap-2">
            {isAdmin && <Link to="/admin" className="btn-secondary btn-sm text-sm">⚙️ Admin</Link>}
            {user ? <button onClick={logout} className="btn-secondary btn-sm text-sm">Déconnexion</button> : <><Link to="/login" className="btn-secondary btn-sm text-sm">Connexion</Link><Link to="/register" className="btn-primary btn-sm text-sm">S'inscrire</Link></>}
          </nav>
        </div>
      </header>

      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4 text-center">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl mb-3">CC Alpes Provence Verdon</h1>
        <p className="text-blue-200 text-lg">Toute l'actualité de votre communauté de communes</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex-1">
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => { setCategory(''); setPage(1) }} className={`badge text-sm px-3 py-1.5 cursor-pointer ${!category ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>Tout</button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => { setCategory(c.id); setPage(1) }} className={`badge text-sm px-3 py-1.5 cursor-pointer ${category === c.id ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{c.icon} {c.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 text-slate-400"><p className="text-4xl mb-3">📭</p><p>Aucun article</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {articles.map(a => {
                const cat = CATEGORIES.find(c => c.id === a.category)
                return (
                  <Link key={a.id} to={`/news/${a.id}`} className="card group hover:shadow-md transition-shadow flex flex-col">
                    {a.image_url ? <img src={a.image_url} alt={a.title} className="w-full h-44 object-cover" /> : <div className="w-full h-44 bg-blue-100 flex items-center justify-center text-4xl">{cat?.icon ?? '📰'}</div>}
                    <div className="p-5 flex flex-col flex-1">
                      <span className="badge-blue mb-2">{cat?.icon} {cat?.label}</span>
                      <h2 className="font-display font-semibold text-blue-900 text-base line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">{a.title}</h2>
                      {a.excerpt && <p className="text-slate-500 text-sm line-clamp-2 flex-1">{a.excerpt}</p>}
                      <p className="text-xs text-slate-400 mt-3">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary btn-sm disabled:opacity-40">← Précédent</button>
                <span className="text-sm text-slate-500 px-2">Page {page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary btn-sm disabled:opacity-40">Suivant →</button>
              </div>
            )}
          </>
        )}
      </div>

      <footer className="bg-blue-900 text-blue-200 py-8 text-center mt-12">
        <p className="font-display font-semibold text-white mb-1">CC Alpes Provence Verdon</p>
        <p className="text-sm">© {new Date().getFullYear()} — Tous droits réservés</p>
      </footer>
    </div>
  )
}
