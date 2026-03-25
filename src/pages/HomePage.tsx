import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedNews } from '../lib/newsService'
import { TABS, getCategoryById, getTabById } from '../constants'
import { ArrowRight, Calendar, ChevronDown, Clock, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatDate } from '../utils'

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    const categoryFilter = selectedSub || undefined
    const tabFilter = !selectedSub && selectedTab ? selectedTab : undefined

    getPublishedNews({ category: categoryFilter, tab: tabFilter, limit: 20 })
      .then(({ data }) => setArticles(data))
      .catch(() => setError('Impossible de charger les articles. Verifie ta connexion.'))
      .finally(() => setLoading(false))
  }, [selectedTab, selectedSub])

  const featured = articles[0]
  const rest = articles.slice(1)

  function handleTabClick(tabId: string) {
    if (selectedTab === tabId) {
      setSelectedTab(null)
      setSelectedSub(null)
    } else {
      setSelectedTab(tabId)
      setSelectedSub(null)
    }
  }

  function handleSubClick(subId: string) {
    setSelectedSub(selectedSub === subId ? null : subId)
  }

  const activeTab = selectedTab ? getTabById(selectedTab) : null

  return (
    <div className="space-y-8 pb-8">
      {/* Hero featured article */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">
              A la une
            </h2>
          </div>
          <Link
            to="/explorer"
            className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:text-indigo-800 transition-colors flex items-center gap-1"
          >
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        ) : loading && !selectedTab ? (
          <div className="space-y-4">
            <div className="h-56 bg-slate-200 rounded-3xl animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        ) : featured ? (
          <div className="space-y-3">
            {/* Main featured */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                to={`/news/${featured.id}`}
                className="block rounded-3xl overflow-hidden group"
              >
                <div className="relative h-56">
                  {featured.image_url ? (
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      loading="eager"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {(() => {
                      const cat = getCategoryById(featured.category_id)
                      return cat ? (
                        <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full text-white mb-2 inline-block', cat.tabColor)}>
                          {cat.tabIcon} {cat.label}
                        </span>
                      ) : null
                    })()}
                    <h3 className="text-white font-display font-extrabold text-xl leading-tight line-clamp-2 mb-1.5">
                      {featured.title}
                    </h3>
                    {featured.summary && (
                      <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
                        {featured.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-white/50 text-xs mt-2">
                      <Clock size={12} />
                      <span>{formatDate(featured.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Secondary featured (2 small cards) */}
            {articles.length > 1 && (
              <div className="grid grid-cols-2 gap-3">
                {articles.slice(1, 3).map((a, i) => {
                  const cat = getCategoryById(a.category_id)
                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        to={`/news/${a.id}`}
                        className="block rounded-2xl overflow-hidden group h-36 relative"
                      >
                        {a.image_url ? (
                          <img
                            src={a.image_url}
                            alt={a.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className={cn('w-full h-full', cat?.tabColor ?? 'bg-gradient-to-br from-indigo-400 to-indigo-600')} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4 className="text-white font-bold text-xs leading-tight line-clamp-2">
                            {a.title}
                          </h4>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 bg-white rounded-3xl border border-slate-200 flex items-center justify-center text-slate-400 font-medium">
            Aucune actualite pour le moment
          </div>
        )}
      </section>

      {/* Onglets */}
      <section>
        <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight mb-4">
          Thematiques
        </h2>
        <div className="space-y-2">
          {TABS.map((tab) => {
            const isOpen = selectedTab === tab.id
            return (
              <div key={tab.id}>
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200',
                    isOpen
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-white border border-slate-100 text-slate-700 hover:shadow-md'
                  )}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <span className="font-bold text-sm flex-1 text-left">{tab.label}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'transition-transform duration-200',
                      isOpen ? 'rotate-180' : ''
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 px-2 pt-2 pb-1">
                        {tab.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleSubClick(sub.id)}
                            className={cn(
                              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all border',
                              selectedSub === sub.id
                                ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                                : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-indigo-200 hover:text-indigo-600'
                            )}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* Liste des articles - nouveau design cartes horizontales */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">
            {selectedSub
              ? getCategoryById(selectedSub)?.label
              : activeTab
                ? activeTab.label
                : 'Dernieres infos'}
          </h2>
          {(selectedTab || selectedSub) && (
            <button
              onClick={() => {
                setSelectedTab(null)
                setSelectedSub(null)
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
            >
              Reinitialiser
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-28 h-24 bg-slate-200 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-slate-200 rounded w-16" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-500 font-medium">Aucune information trouvee</p>
            <p className="text-slate-400 text-sm mt-1">Essayez une autre thematique</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(rest.length > 0 ? rest : articles).map((a, i) => {
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
                    {/* Thumbnail */}
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

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        {cat && (
                          <span className={cn(
                            'text-[10px] font-bold uppercase tracking-wider',
                            cat.tabColor === 'bg-violet-500' ? 'text-violet-600' :
                            cat.tabColor === 'bg-blue-500' ? 'text-blue-600' :
                            cat.tabColor === 'bg-teal-500' ? 'text-teal-600' :
                            cat.tabColor === 'bg-rose-500' ? 'text-rose-600' :
                            cat.tabColor === 'bg-sky-500' ? 'text-sky-600' :
                            cat.tabColor === 'bg-amber-500' ? 'text-amber-600' :
                            cat.tabColor === 'bg-purple-500' ? 'text-purple-600' :
                            'text-indigo-600'
                          )}>
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

                    {/* Arrow */}
                    <div className="flex items-center shrink-0">
                      <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Voir plus */}
        {articles.length >= 20 && (
          <div className="text-center pt-4">
            <Link
              to="/explorer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm font-bold text-indigo-600 hover:bg-indigo-100 transition-all"
            >
              Voir plus d'articles <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
