import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Pencil, X, Send, Megaphone, Info, Calendar, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from '../../lib/notificationService'
import { useAuth } from '../../context/AuthContext'

const ALERT_TYPES = [
  { value: 'info', label: 'Info', icon: Info, color: 'bg-blue-50 text-blue-600 border-blue-200', badge: 'badge-blue', iconBg: 'bg-blue-50 text-blue-500' },
  { value: 'event', label: 'Événement', icon: Calendar, color: 'bg-emerald-50 text-emerald-600 border-emerald-200', badge: 'badge-green', iconBg: 'bg-emerald-50 text-emerald-500' },
  { value: 'important', label: 'Important', icon: AlertTriangle, color: 'bg-red-50 text-red-600 border-red-200', badge: 'badge-yellow', iconBg: 'bg-amber-50 text-amber-500' },
] as const

function getAlertType(type: string) {
  return ALERT_TYPES.find((t) => t.value === type) ?? ALERT_TYPES[0]
}
import AdminLayout from '../../components/AdminLayout'
import ConfirmDialog from '../../components/ConfirmDialog'
import { LIMITS } from '../../lib/validate'

export default function AdminAlerts() {
  const { user, isSuperAdmin, communeId } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [alertType, setAlertType] = useState('info')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const LIMIT = 20

  const load = useCallback(() => {
    setLoading(true)
    getAllNotifications({ page, limit: LIMIT, communeId: isSuperAdmin ? undefined : communeId })
      .then(({ data, count }) => {
        setNotifications(data)
        setTotal(count)
      })
      .finally(() => setLoading(false))
  }, [page, isSuperAdmin, communeId])

  useEffect(() => {
    load()
  }, [load])

  function openCreate() {
    setEditingId(null)
    setTitle('')
    setBody('')
    setAlertType('info')
    setFormError('')
    setShowForm(true)
  }

  function openEdit(n: any) {
    setEditingId(n.id)
    setTitle(n.title)
    setBody(n.body)
    setAlertType(n.type || 'info')
    setFormError('')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setFormError('Le titre est obligatoire')
      return
    }
    if (!body.trim()) {
      setFormError('Le contenu est obligatoire')
      return
    }

    setSaving(true)
    setFormError('')
    try {
      if (editingId) {
        await updateNotification(editingId, {
          title: title.trim(),
          body: body.trim(),
          type: alertType,
        })
      } else {
        await createNotification({
          title: title.trim(),
          body: body.trim(),
          type: alertType,
          sent_by: user?.id,
          commune_id: isSuperAdmin ? undefined : communeId ?? undefined,
        })
      }
      closeForm()
      load()
    } catch (err: any) {
      setFormError(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-2xl text-slate-900">
          Alertes ({total})
        </h2>
        <button onClick={openCreate} className="btn-primary btn-sm">
          <Plus size={16} />
          Nouvelle alerte
        </button>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && closeForm()}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {editingId ? 'Modifier l\'alerte' : 'Nouvelle alerte'}
                </h3>
                <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Nouvelle aide au permis disponible"
                    className="input-field"
                    maxLength={LIMITS.ALERT_TITLE}
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Contenu *
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Détails de l'alerte..."
                    rows={4}
                    className="input-field resize-none"
                    maxLength={LIMITS.ALERT_BODY}
                  />
                </div>

                {/* Alert type */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Type d'alerte
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ALERT_TYPES.map((t) => {
                      const Icon = t.icon
                      const selected = alertType === t.value
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setAlertType(t.value)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                            selected
                              ? `${t.color} border-current font-bold shadow-sm`
                              : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="text-xs font-semibold">{t.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {formError && (
                  <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary w-full"
                >
                  {saving ? (
                    'Envoi...'
                  ) : editingId ? (
                    <>
                      <Pencil size={16} /> Modifier
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Envoyer l'alerte
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="card p-12 text-center">
              <Megaphone size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium mb-4">Aucune alerte envoyée</p>
              <button onClick={openCreate} className="btn-primary btn-sm">
                <Plus size={16} /> Créer la première alerte
              </button>
            </div>
          ) : (
            notifications.map((n) => {
              const at = getAlertType(n.type)
              const TypeIcon = at.icon
              return (
              <div key={n.id} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${at.iconBg}`}>
                    <TypeIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                      <span className={`${at.badge} text-[10px]`}>{at.label}</span>
                    </div>
                    <p className="text-slate-600 text-sm mt-1 line-clamp-2">{n.body}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span>
                        {n.sent_at
                          ? new Date(n.sent_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Non envoyée'}
                      </span>
                      {!n.commune_id && (
                        <span className="badge-green text-[10px]">
                          Globale
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
                  <button
                    onClick={() => openEdit(n)}
                    className="btn-secondary btn-sm text-xs"
                  >
                    <Pencil size={12} /> Modifier
                  </button>
                  <button
                    onClick={() => setDeleteId(n.id)}
                    className="btn-danger btn-sm text-xs ml-auto"
                  >
                    <Trash2 size={12} /> Supprimer
                  </button>
                </div>
              </div>
              )
            })
          )}
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
        title="Supprimer l'alerte"
        message="Cette alerte sera supprimée définitivement."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteNotification(deleteId).then(load)
          setDeleteId(null)
        }}
      />
    </AdminLayout>
  )
}
