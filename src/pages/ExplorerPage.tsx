import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Calendar, ArrowRight, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPublishedNews, type SortOption } from '../lib/newsService'
import { TABS, getCategoryById } from '../constants'
import { cn, formatDate } from '../utils'

export default function ExplorerPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')

  const doSearch = useCallback(() => {
    setLoading(true)
    setError('')
    getPublishedNews({
      category: selectedSub || undefined,
      tab: !selectedSub && selectedTab ? selectedTab : undefined,
      search: searchTerm || undefined,
      sort: sortBy,
      limit: 50,
    })
      .then(({ data, count }) => {
        setResults(data)
        setTotal(count)
      })
      .catch(() => setError('Impossible de charger les resultats.'))
      .finally(() => setLoading(false))
  }, [searchTerm, selectedTab, selectedSub, sortBy])

  useEffect(() => {
    const timeout = setTimeout(doSearch, 300)
    return () => clearTimeout(timeout)
  }, [doSearch])

  const activeTab = selectedTab ? TABS.find((t) => t.id === selectedTab) : null

  return (
    <div className="space-y-6 pb-8">
      <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
        Explorer
      </h2>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher un sujet, une aide..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium shadow-sm text-slate-800 placeholder-slate-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Tab chips */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4">
        <button
          onClick={() => {
            setSelectedTab(null)
            setSelectedSub(null)
          }}
          className={cn(
            'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border shrink-0',
            !selectedTab
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
              : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-200'
          )}
        >
          Tout
        </button>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (selectedTab === tab.id) {
                setSelectedTab(null)
                setSelectedSub(null)
              } else {
                setSelectedTab(tab.id)
                setSelectedSub(null)
              }
            }}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border shrink-0',
              selectedTab === tab.id
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-200'
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Subcategory chips (when a tab is selected) */}
      {activeTab && (
        <div className="flex flex-wrap gap-2">
          {activeTab.subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSub(selectedSub === sub.id ? null : sub.id)}
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
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-medium text-center">
          {error}
        </div>
      )}

      {/* Results count + sort */}
      {!loading && !error && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {total} resultat{total !== 1 ? 's' : ''}
            {searchTerm && <> pour &laquo; {searchTerm} &raquo;</>}
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-600 font-medium outline-none focus:border-indigo-300"
          >
            <option value="recent">Plus recents</option>
            <option value="oldest">Plus anciens</option>
            <option value="title_asc">Titre A-Z</option>
            <option value="title_desc">Titre Z-A</option>
          </select>
        </div>
      )}

      {/* Results - horizontal card layout */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
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
          ) : results.length > 0 ? (
            results.map((a, i) => {
              const cat = getCategoryById(a.category_id)
              return (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
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
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                <SlidersHorizontal size={32} />
              </div>
              <h4 className="text-xl font-display font-extrabold text-slate-900 mb-1">
                Aucun resultat
              </h4>
              <p className="text-slate-500 font-medium">
                Essaie d'autres mots-cles ou categories.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
