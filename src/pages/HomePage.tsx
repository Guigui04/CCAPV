import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPublishedNews } from '../lib/newsService'
import { TABS, getCategoryById, getTabById } from '../constants'
import { ArrowRight, Calendar, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, formatDate } from '../utils'

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // If a subcategory is selected, filter by it; if only a tab, filter by all its subcategories
    const categoryFilter = selectedSub || undefined
    const tabFilter = !selectedSub && selectedTab ? selectedTab : undefined

    getPublishedNews({ category: categoryFilter, tab: tabFilter, limit: 20 })
      .then(({ data }) => setArticles(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedTab, selectedSub])

  const featured = articles.slice(0, 3)

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
      {/* A la une */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            A la une
          </h2>
          <Link
            to="/explorer"
            className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:text-indigo-800 transition-colors"
          >
            Voir tout
          </Link>
        </div>

        {loading && !selectedTab ? (
          <div className="h-48 bg-slate-200 rounded-3xl animate-pulse" />
        ) : featured.length === 0 ? (
          <div className="h-48 bg-white rounded-3xl border border-slate-200 flex items-center justify-center text-slate-400 font-medium">
            Aucune actualite pour le moment
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-2 snap-x scrollbar-hide -mx-4 px-4">
            {featured.map((a, i) => {
              const cat = getCategoryById(a.category_id)
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
                          cat?.tabColor ?? 'bg-gradient-to-br from-indigo-400 to-indigo-600'
                        )}
                      >
                        {cat?.tabIcon ?? '📰'}
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

      {/* Onglets */}
      <section>
        <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight mb-4">
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

      {/* Liste des articles */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
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
              <div key={i} className="h-44 bg-slate-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-500 font-medium">Aucune information trouvee</p>
            <p className="text-slate-400 text-sm mt-1">Essayez une autre thematique</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {articles.map((a, i) => {
              const cat = getCategoryById(a.category_id)
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
                          cat?.tabColor ?? 'bg-gradient-to-br from-indigo-400 to-indigo-600'
                        )}
                      >
                        {cat?.tabIcon ?? '📰'}
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
