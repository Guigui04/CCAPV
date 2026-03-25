import { useState, useEffect, useCallback } from 'react'
import {
  getFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
} from '../../lib/feedbackService'
import { supabase } from '../../lib/supabase'
import { REACTION_LABELS, FEEDBACK_STATUS_LABELS } from '../../constants'
import { User } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import ConfirmDialog from '../../components/ConfirmDialog'

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [authors, setAuthors] = useState<Record<string, { first_name?: string; last_name?: string }>>({})
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const LIMIT = 20

  const load = useCallback(() => {
    setLoading(true)
    getFeedbacks({ status: status || undefined, page, limit: LIMIT })
      .then(async ({ data, count }) => {
        setFeedbacks(data)
        setTotal(count)
        // Fetch author profiles
        const userIds = [...new Set(data.map((f: any) => f.user_id).filter(Boolean))]
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', userIds)
          if (profiles) {
            const map: Record<string, { first_name?: string; last_name?: string }> = {}
            for (const p of profiles) {
              map[p.id] = { first_name: p.first_name, last_name: p.last_name }
            }
            setAuthors(map)
          }
        }
      })
      .finally(() => setLoading(false))
  }, [status, page])

  useEffect(() => {
    load()
  }, [load])

  const totalPages = Math.ceil(total / LIMIT)

  function getAuthorName(userId?: string) {
    if (!userId) return 'Utilisateur anonyme'
    const a = authors[userId]
    if (!a) return 'Utilisateur'
    const name = `${a.first_name ?? ''} ${a.last_name ?? ''}`.trim()
    return name || 'Utilisateur'
  }

  function statusBadge(s: string) {
    if (s === 'processed') return <span className="badge-green">Traité</span>
    if (s === 'archived') return <span className="badge-gray">Archivé</span>
    return <span className="badge-yellow">Nouveau</span>
  }

  function reactionBadge(r: string) {
    return (
      <span className="badge-blue text-xs">
        {REACTION_LABELS[r] ?? r}
      </span>
    )
  }

  const FILTERS = [
    { value: '', label: 'Tous' },
    { value: 'new', label: 'Nouveaux' },
    { value: 'processed', label: 'Traités' },
    { value: 'archived', label: 'Archivés' },
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
                {reactionBadge(f.reaction)}
                {f.news?.title && (
                  <span className="text-xs text-slate-400">· {f.news.title}</span>
                )}
                <span className="text-xs text-slate-300 ml-auto">
                  {new Date(f.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              {/* Auteur */}
              <div className="flex items-center gap-2 mt-2 mb-1">
                <div className="w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center">
                  <User size={12} className="text-indigo-500" />
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {getAuthorName(f.user_id)}
                </span>
              </div>
              {f.comment && (
                <p className="text-slate-700 text-sm leading-relaxed mt-1">{f.comment}</p>
              )}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
                {f.status === 'new' && (
                  <button
                    onClick={() =>
                      updateFeedbackStatus(f.id, 'processed').then(load)
                    }
                    className="btn-secondary btn-sm text-xs text-green-700"
                  >
                    Marquer traité
                  </button>
                )}
                {f.status !== 'archived' && (
                  <button
                    onClick={() =>
                      updateFeedbackStatus(f.id, 'archived').then(load)
                    }
                    className="btn-secondary btn-sm text-xs text-slate-600"
                  >
                    Archiver
                  </button>
                )}
                <button
                  onClick={() => setDeleteId(f.id)}
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
      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer le feedback"
        message="Cette action est irreversible."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteFeedback(deleteId).then(load)
          setDeleteId(null)
        }}
      />
    </AdminLayout>
  )
}
