import { useState, useEffect } from 'react'
import { BarChart3, Eye, Users, FileText, Download } from 'lucide-react'
import { getAnalytics, type AnalyticsData } from '../../lib/analyticsService'
import { exportToCSV } from '../../lib/exportService'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'

const PERIODS = [
  { value: 7, label: '7 jours' },
  { value: 30, label: '30 jours' },
  { value: 90, label: '90 jours' },
]

export default function AdminAnalytics() {
  const { isSuperAdmin, communeId } = useAuth()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    setLoading(true)
    getAnalytics({ communeId: isSuperAdmin ? undefined : communeId, days })
      .then(setData)
      .finally(() => setLoading(false))
  }, [days, isSuperAdmin, communeId])

  function handleExport() {
    if (!data) return
    exportToCSV(
      data.topArticles.map((a) => ({ titre: a.title, vues: a.views })),
      `analytics-top-articles-${days}j`,
      [
        { key: 'titre', label: 'Article' },
        { key: 'vues', label: 'Vues' },
      ]
    )
  }

  const maxViews = data ? Math.max(...data.topArticles.map((a) => a.views), 1) : 1

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display font-bold text-xl lg:text-2xl text-slate-900">
          Statistiques
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="input-field py-1.5 text-sm w-32"
          >
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {data && (
            <button onClick={handleExport} className="btn-secondary btn-sm">
              <Download size={14} /> CSV
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data ? (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                  <Eye size={20} />
                </div>
                <span className="text-sm text-slate-500">Vues totales</span>
              </div>
              <p className="text-3xl font-display font-bold text-slate-900">{data.totalViews}</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                  <Users size={20} />
                </div>
                <span className="text-sm text-slate-500">Utilisateurs</span>
              </div>
              <p className="text-3xl font-display font-bold text-slate-900">{data.totalUsers}</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                  <FileText size={20} />
                </div>
                <span className="text-sm text-slate-500">Articles publiés</span>
              </div>
              <p className="text-3xl font-display font-bold text-slate-900">{data.totalArticles}</p>
            </div>
          </div>

          {/* Top articles */}
          <div className="card p-5 mb-6">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-indigo-500" />
              Top articles
            </h3>
            {data.topArticles.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Aucune vue sur cette période</p>
            ) : (
              <div className="space-y-3">
                {data.topArticles.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-5 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{a.title}</p>
                      <div className="mt-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${(a.views / maxViews) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 w-12 text-right">{a.views}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Views by day chart */}
          {data.viewsByDay.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display font-bold text-lg text-slate-900 mb-4">
                Vues par jour
              </h3>
              <div className="flex items-end gap-1 h-32">
                {data.viewsByDay.map((d) => {
                  const maxDay = Math.max(...data.viewsByDay.map((x) => x.count), 1)
                  const height = (d.count / maxDay) * 100
                  return (
                    <div
                      key={d.date}
                      className="flex-1 bg-indigo-500 rounded-t hover:bg-indigo-600 transition-colors group relative"
                      style={{ height: `${Math.max(height, 4)}%` }}
                      title={`${d.date}: ${d.count} vues`}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {d.count}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                <span>{data.viewsByDay[0]?.date}</span>
                <span>{data.viewsByDay[data.viewsByDay.length - 1]?.date}</span>
              </div>
            </div>
          )}
        </>
      ) : null}
    </AdminLayout>
  )
}
