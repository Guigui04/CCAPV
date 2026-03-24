import { useState, useEffect, useCallback } from 'react'
import {
  getFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
} from '../../lib/feedbackService'
import AdminLayout from '../../components/AdminLayout'

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const LIMIT = 20

  const load = useCallback(() => {
    setLoading(true)
    getFeedbacks({ status: status || undefined, page, limit: LIMIT })
      .then(({ data, count }) => {
        setFeedbacks(data)
        setTotal(count)
      })
      .finally(() => setLoading(false))
  }, [status, page])

  useEffect(() => {
    load()
  }, [load])

  const totalPages = Math.ceil(total / LIMIT)

  function statusBadge(s: string) {
    if (s === 'approved') return <span className="badge-green">✅ Approuvé</span>
    if (s === 'rejected') return <span className="badge-red">❌ Rejeté</span>
    return <span className="badge-yellow">⏳ En attente</span>
  }

  const FILTERS = [
    { value: '', label: 'Tous' },
    { value: 'pending', label: '⏳ En attente' },
    { value: 'approved', label: '✅ Approuvés' },
    { value: 'rejected', label: '❌ Rejetés' },
  ]

  return (
    <AdminLayout>
      <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">
        Feedbacks ({total})
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatus(f.value)
              setPage(1)
            }}
            className={`badge text-sm px-3 py-1.5 cursor-pointer transition-all ${
              status === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.length === 0 && (
            <div className="card p-12 text-center text-slate-400">
              Aucun feedback
            </div>
          )}
          {feedbacks.map((f) => (
            <div key={f.id} className="card p-5">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {statusBadge(f.status)}
                <span className="text-xs text-slate-400">{f.author_email}</span>
                {f.news?.title && (
                  <span className="text-xs text-slate-400">· {f.news.title}</span>
                )}
                <span className="text-xs text-slate-300 ml-auto">
                  {new Date(f.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{f.content}</p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
                {f.status !== 'approved' && (
                  <button
                    onClick={() =>
                      updateFeedbackStatus(f.id, 'approved').then(load)
                    }
                    className="btn-secondary btn-sm text-xs text-green-700"
                  >
                    ✅ Approuver
                  </button>
                )}
                {f.status !== 'rejected' && (
                  <button
                    onClick={() =>
                      updateFeedbackStatus(f.id, 'rejected').then(load)
                    }
                    className="btn-secondary btn-sm text-xs text-yellow-700"
                  >
                    ❌ Rejeter
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('Supprimer ce feedback ?'))
                      deleteFeedback(f.id).then(load)
                  }}
                  className="btn-danger btn-sm text-xs ml-auto"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-secondary btn-sm disabled:opacity-40"
          >
            ← Précédent
          </button>
          <span className="text-sm text-slate-500">
            Page {page}/{totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-secondary btn-sm disabled:opacity-40"
          >
            Suivant →
          </button>
        </div>
      )}
    </AdminLayout>
  )
}
