import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Calendar, ArrowRight, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPublishedNews } from '../lib/newsService'
import { TABS, getCategoryById } from '../constants'
import { cn, formatDate } from '../utils'

export default function ExplorerPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  const doSearch = useCallback(() => {
    setLoading(true)
    getPublishedNews({
      category: selectedSub || undefined,
      tab: !selectedSub && selectedTab ? selectedTab : undefined,
      search: searchTerm || undefined,
      limit: 50,
    })
      .then(({ data, count }) => {
        setResults(data)
        setTotal(count)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [searchTerm, selectedTab, selectedSub])

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

      {/* Results count */}
      {!loading && (
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {total} resultat{total !== 1 ? 's' : ''}
          {searchTerm && <> pour &laquo; {searchTerm} &raquo;</>}
        </p>
      )}

      {/* Results */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 bg-slate-200 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : results.length > 0 ? (
            results.map((a, i) => {
              const cat = getCategoryById(a.category_id)
              return (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
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
