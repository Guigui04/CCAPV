import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedNews } from '../lib/newsService'
import { CATEGORIES, getCategoryById } from '../constants'
import { ArrowRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, formatDate } from '../utils'

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPublishedNews({ category: category || undefined, limit: 20 })
      .then(({ data }) => setArticles(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category])

  const featured = articles.slice(0, 3)

  return (
    <div className="space-y-8 pb-8">
      {/* À la une */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            À la une
          </h2>
          <Link
            to="/explorer"
            className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:text-indigo-800 transition-colors"
          >
            Voir tout
          </Link>
        </div>

        {loading ? (
          <div className="h-48 bg-slate-200 rounded-3xl animate-pulse" />
        ) : featured.length === 0 ? (
          <div className="h-48 bg-white rounded-3xl border border-slate-200 flex items-center justify-center text-slate-400 font-medium">
            Aucune actualité pour le moment
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-2 snap-x scrollbar-hide -mx-4 px-4">
            {featured.map((a, i) => {
              const cat = getCategoryById(a.category)
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/news/${a.id}`}
                    className="min-w-[280px] snap-center relative rounded-3xl overflow-hidden h-48 flex-shrink-0 block group"
                  >
                    {a.image_url ? (
                      <img
                        src={a.image_url}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className={cn(
                          'w-full h-full flex items-center justify-center text-5xl',
                          cat?.color ?? 'bg-gradient-to-br from-indigo-400 to-indigo-600'
                        )}
                      >
                        {cat?.icon ?? '📰'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                        {cat?.label ?? 'Info'}
                      </span>
                      <h3 className="text-white font-bold text-base leading-tight line-clamp-2">
                        {a.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-white/60 text-[11px] mt-1.5">
                        <Calendar size={11} />
                        <span>{formatDate(a.created_at)}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-indigo-600 transition-colors text-white">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      {/* Catégories */}
      <section>
        <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight mb-4">
          Catégories
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(category === c.id ? '' : c.id)}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all duration-200',
                  category === c.id
                    ? 'bg-indigo-600 scale-105 shadow-indigo-200 ring-2 ring-indigo-400 ring-offset-2'
                    : 'bg-white border border-slate-100 hover:shadow-md'
                )}
              >
                {c.icon}
              </div>
              <span
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wide text-center leading-tight',
                  category === c.id ? 'text-indigo-600' : 'text-slate-500'
                )}
              >
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Liste des articles */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            {category ? getCategoryById(category)?.label : 'Dernières infos'}
          </h2>
          {category && (
            <button
              onClick={() => setCategory('')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-slate-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-500 font-medium">Aucune information trouvée</p>
            <p className="text-slate-400 text-sm mt-1">Essayez une autre catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {articles.map((a, i) => {
              const cat = getCategoryById(a.category)
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/news/${a.id}`}
                    className="relative rounded-3xl overflow-hidden h-44 block group"
                  >
                    {a.image_url ? (
                      <img
                        src={a.image_url}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className={cn(
                          'w-full h-full flex items-center justify-center text-6xl',
                          cat?.color ?? 'bg-gradient-to-br from-indigo-400 to-indigo-600'
                        )}
                      >
                        {cat?.icon ?? '📰'}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                        {cat?.label ?? 'Info'}
                      </span>
                      <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                        {a.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-white/60 text-[11px] mt-1.5">
                        <Calendar size={11} />
                        <span>{formatDate(a.created_at)}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-5 right-5 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-indigo-600 transition-colors text-white">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
