import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import {
  getCommunes,
  createCommune,
  updateCommune,
  deleteCommune,
  type Commune,
} from '../../lib/communeService'
import AdminLayout from '../../components/AdminLayout'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useToast } from '../../components/Toast'
import { LIMITS } from '../../lib/validate'

const PLANS = [
  { value: 'free', label: 'Gratuit', color: 'badge-gray' },
  { value: 'starter', label: 'Starter', color: 'badge-blue' },
  { value: 'pro', label: 'Pro', color: 'badge-green' },
  { value: 'enterprise', label: 'Enterprise', color: 'badge-yellow' },
]

export default function AdminCommunes() {
  const toast = useToast()
  const [communes, setCommunes] = useState<Commune[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formPlan, setFormPlan] = useState('free')
  const [formActive, setFormActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const LIMIT = 20

  const load = useCallback(() => {
    setLoading(true)
    getCommunes({ page, limit: LIMIT, search: search || undefined })
      .then(({ data, count }) => {
        setCommunes(data as Commune[])
        setTotal(count)
      })
      .finally(() => setLoading(false))
  }, [page, search])

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [load])

  function openCreate() {
    setEditingId(null)
    setFormName('')
    setFormSlug('')
    setFormPlan('free')
    setFormActive(true)
    setShowForm(true)
  }

  function openEdit(c: Commune) {
    setEditingId(c.id)
    setFormName(c.name)
    setFormSlug(c.slug)
    setFormPlan(c.plan)
    setFormActive(c.is_active)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) {
      toast.warning('Le nom est obligatoire')
      return
    }
    if (!formSlug.trim()) {
      toast.warning('Le slug est obligatoire')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        await updateCommune(editingId, {
          name: formName,
          slug: formSlug,
          plan: formPlan,
          is_active: formActive,
        })
      } else {
        await createCommune({
          name: formName,
          slug: formSlug,
          plan: formPlan,
        })
      }
      setShowForm(false)
      load()
      toast.success(editingId ? 'Commune modifiée' : 'Commune créée')
    } catch (err: any) {
      toast.error(err.message || 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  function getPlanBadge(plan: string) {
    const p = PLANS.find((x) => x.value === plan) ?? PLANS[0]
    return <span className={p.color}>{p.label}</span>
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display font-bold text-xl lg:text-2xl text-slate-900">
          Communes ({total})
        </h2>
        <button onClick={openCreate} className="btn-primary btn-sm">
          <Plus size={16} /> Nouvelle commune
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Rechercher une commune..."
          className="input-field"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {communes.length === 0 && (
            <div className="card p-12 text-center text-slate-400">
              Aucune commune trouvée
            </div>
          )}
          {communes.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: c.primary_color || '#4F46E5' }}
                  >
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                    <p className="text-xs text-slate-400">/{c.slug}</p>
                  </div>
                </div>
                <span className={c.is_active ? 'badge-green' : 'badge-gray'}>
                  {c.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {getPlanBadge(c.plan)}
                <span className="text-xs text-slate-400">
                  Max {c.max_admins} admins · {c.max_news} articles
                </span>
                {c.subscription_status && c.subscription_status !== 'inactive' && (
                  <span className="badge-blue text-[10px]">{c.subscription_status}</span>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-50">
                <button
                  onClick={() => openEdit(c)}
                  className="btn-secondary btn-sm text-xs"
                >
                  <Pencil size={12} /> Modifier
                </button>
                <button
                  onClick={() => setDeleteId(c.id)}
                  className="btn-danger btn-sm text-xs ml-auto"
                >
                  <Trash2 size={12} /> Supprimer
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
            &larr; Précédent
          </button>
          <span className="text-sm text-slate-500">
            Page {page}/{totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-secondary btn-sm disabled:opacity-40"
          >
            Suivant &rarr;
          </button>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end lg:items-center justify-center lg:p-4">
          <div className="bg-white w-full lg:rounded-2xl lg:shadow-xl lg:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="font-display font-bold text-lg text-slate-900">
                {editingId ? 'Modifier la commune' : 'Nouvelle commune'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom *</label>
                <input
                  className="input-field"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value)
                    if (!editingId) {
                      setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                    }
                  }}
                  required
                  maxLength={LIMITS.NAME}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug *</label>
                <input
                  className="input-field"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  required
                  maxLength={50}
                />
                <p className="text-xs text-slate-400 mt-1">Identifiant URL (ex: cc-alpes-provence)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Plan</label>
                <select
                  className="input-field"
                  value={formPlan}
                  onChange={(e) => setFormPlan(e.target.value)}
                >
                  {PLANS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              {editingId && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer la commune"
        message="Cette action supprimera la commune et toutes ses données associées. Cette action est irréversible."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteCommune(deleteId).then(load)
          setDeleteId(null)
        }}
      />
    </AdminLayout>
  )
}
