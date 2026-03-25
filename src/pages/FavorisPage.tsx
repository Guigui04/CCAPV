import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, ArrowRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getBookmarkedArticles } from '../lib/bookmarkService'
import { getCategoryById } from '../constants'
import { cn, formatDate } from '../utils'

export default function FavorisPage() {
  const { user } = useAuth()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    getBookmarkedArticles(user.id)
      .then(setArticles)
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="space-y-6 pb-8">
        <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
          Mes favoris
        </h2>
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 mx-auto mb-4">
            <Bookmark size={32} />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
            Sauvegarde tes articles
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
            Connecte-toi pour sauvegarder les articles qui t'intéressent.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Se connecter
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
        Mes favoris
        {articles.length > 0 && (
          <span className="ml-2 inline-flex items-center justify-center px-2 h-6 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full">
            {articles.length}
          </span>
        )}
      </h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-28 h-24 bg-slate-200 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-slate-200 rounded w-16" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
            <Bookmark size={32} />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
            Aucun favori
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Sauvegarde des articles en cliquant sur le bouton "Sauvegarder" dans un article.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a, i) => {
            const cat = getCategoryById(a.category_id)
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/news/${a.id}`}
                  className="flex gap-4 bg-white rounded-2xl border border-slate-100 p-3 group hover:shadow-md hover:border-slate-200 transition-all"
                >
                  <div className="w-28 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    {a.image_url ? (
                      <img
                        src={a.image_url}
                        alt={a.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={cn(
                        'w-full h-full flex items-center justify-center text-3xl',
                        cat?.tabColor ?? 'bg-gradient-to-br from-indigo-400 to-indigo-600'
                      )}>
                        {cat?.tabIcon ?? '📰'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      {cat && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {cat.tabIcon} {cat.label}
                        </span>
                      )}
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mt-0.5 group-hover:text-indigo-600 transition-colors">
                        {a.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Calendar size={11} />
                      <span>{formatDate(a.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center shrink-0">
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
