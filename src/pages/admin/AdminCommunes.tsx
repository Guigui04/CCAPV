import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Pencil, Trash2, X, Search, Filter, CheckSquare, Square,
  ToggleLeft, ToggleRight, ChevronDown, Building2, MapPin, Users,
} from 'lucide-react'
import {
  getCommunes,
  createCommune,
  updateCommune,
  deleteCommune,
  getDistinctRegions,
  getDistinctDepartments,
  bulkUpdateActive,
  type Commune,
  type EpciType,
  type CommuneFilters,
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

const EPCI_TYPES: { value: EpciType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous les types' },
  { value: 'CC', label: 'CC - Communaute de Communes' },
  { value: 'CA', label: 'CA - Communaute d\'Agglomeration' },
  { value: 'CU', label: 'CU - Communaute Urbaine' },
  { value: 'M', label: 'M - Metropole' },
  { value: 'EPT', label: 'EPT - Etablissement Public Territorial' },
]

const ACTIVE_FILTERS: { value: 'all' | 'true' | 'false'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'true', label: 'Actifs' },
  { value: 'false', label: 'Inactifs' },
]

export default function AdminCommunes() {
  const toast = useToast()
  const [communes, setCommunes] = useState<Commune[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<EpciType | 'all'>('all')
  const [filterRegion, setFilterRegion] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'true' | 'false'>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filter options
  const [regions, setRegions] = useState<string[]>([])
  const [departments, setDepartments] = useState<{ code: string; name: string }[]>([])

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Form
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formPlan, setFormPlan] = useState('free')
  const [formActive, setFormActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)

  const LIMIT = 20

  // Load filter options on mount
  useEffect(() => {
    getDistinctRegions().then(setRegions).catch(() => {})
    getDistinctDepartments().then(setDepartments).catch(() => {})
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    const filters: CommuneFilters = {
      page,
      limit: LIMIT,
      search: search || undefined,
      type_epci: filterType,
      region: filterRegion || undefined,
      department_code: filterDept || undefined,
      is_active: filterActive === 'all' ? 'all' : filterActive === 'true',
    }
    getCommunes(filters)
      .then(({ data, count }) => {
        setCommunes(data as Commune[])
        setTotal(count)
      })
      .finally(() => setLoading(false))
  }, [page, search, filterType, filterRegion, filterDept, filterActive])

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [load])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
    setSelectedIds(new Set())
  }, [filterType, filterRegion, filterDept, filterActive])

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === communes.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(communes.map(c => c.id)))
    }
  }

  async function handleBulkActivate(activate: boolean) {
    if (selectedIds.size === 0) return
    setBulkLoading(true)
    try {
      await bulkUpdateActive([...selectedIds], activate)
      setSelectedIds(new Set())
      load()
      toast.success(`${selectedIds.size} commune(s) ${activate ? 'activee(s)' : 'desactivee(s)'}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur'
      toast.error(message)
    } finally {
      setBulkLoading(false)
    }
  }

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
        await createCommune({ name: formName, slug: formSlug, plan: formPlan })
      }
      setShowForm(false)
      load()
      toast.success(editingId ? 'Commune modifiee' : 'Commune creee')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  function getPlanBadge(plan: string) {
    const p = PLANS.find((x) => x.value === plan) ?? PLANS[0]
    return <span className={p.color}>{p.label}</span>
  }

  function getTypeBadge(type?: string | null) {
    if (!type) return null
    const colors: Record<string, string> = {
      CC: 'badge-blue',
      CA: 'badge-green',
      CU: 'badge-yellow',
      M: 'badge-red',
      EPT: 'badge-purple',
    }
    return <span className={colors[type] ?? 'badge-gray'}>{type}</span>
  }

  function formatPopulation(pop?: number | null) {
    if (!pop) return null
    return pop.toLocaleString('fr-FR')
  }

  const totalPages = Math.ceil(total / LIMIT)
  const activeFiltersCount = [
    filterType !== 'all',
    filterRegion !== '',
    filterDept !== '',
    filterActive !== 'all',
  ].filter(Boolean).length

  // Filter departments by selected region
  const filteredDepts = filterRegion
    ? departments.filter(d => {
        const commune = communes.find(c => c.department_code === d.code)
        return commune?.region === filterRegion
      })
    : departments

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-xl lg:text-2xl text-slate-900">
            Intercommunalites ({total})
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            1266 EPCI de France - activez celles que vous gerez
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary btn-sm">
          <Plus size={16} /> Nouvelle
        </button>
      </div>

      {/* Search + Filter toggle */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Rechercher par nom..."
            className="input-field pl-9"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary btn-sm flex items-center gap-1.5 ${activeFiltersCount > 0 ? 'ring-2 ring-indigo-300' : ''}`}
        >
          <Filter size={14} />
          Filtres
          {activeFiltersCount > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Type EPCI</label>
            <select
              className="input-field text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as EpciType | 'all')}
            >
              {EPCI_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Region</label>
            <select
              className="input-field text-sm"
              value={filterRegion}
              onChange={(e) => { setFilterRegion(e.target.value); setFilterDept('') }}
            >
              <option value="">Toutes les regions</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Departement</label>
            <select
              className="input-field text-sm"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="">Tous les departements</option>
              {(filterRegion ? filteredDepts : departments).map(d => (
                <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Statut</label>
            <select
              className="input-field text-sm"
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as 'all' | 'true' | 'false')}
            >
              {ACTIVE_FILTERS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-indigo-700">
            {selectedIds.size} selectionnee(s)
          </span>
          <button
            onClick={() => handleBulkActivate(true)}
            disabled={bulkLoading}
            className="btn-sm bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1"
          >
            <ToggleRight size={14} /> Activer
          </button>
          <button
            onClick={() => handleBulkActivate(false)}
            disabled={bulkLoading}
            className="btn-sm bg-slate-600 text-white hover:bg-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1"
          >
            <ToggleLeft size={14} /> Desactiver
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="btn-sm text-slate-500 hover:text-slate-700 text-xs ml-auto"
          >
            Deselectionner
          </button>
        </div>
      )}

      {/* Table header for select all */}
      {!loading && communes.length > 0 && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <button
            onClick={toggleSelectAll}
            className="text-slate-400 hover:text-indigo-600 transition-colors"
            title={selectedIds.size === communes.length ? 'Tout deselectionner' : 'Tout selectionner'}
          >
            {selectedIds.size === communes.length ? <CheckSquare size={18} /> : <Square size={18} />}
          </button>
          <span className="text-xs text-slate-400">
            {selectedIds.size === communes.length ? 'Tout deselectionner' : 'Selectionner tout'}
          </span>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {communes.length === 0 && (
            <div className="card p-12 text-center text-slate-400">
              Aucune intercommunalite trouvee
            </div>
          )}
          {communes.map((c) => (
            <div
              key={c.id}
              className={`card p-4 transition-all ${selectedIds.has(c.id) ? 'ring-2 ring-indigo-300 bg-indigo-50/50' : ''}`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelect(c.id)}
                  className="text-slate-300 hover:text-indigo-600 transition-colors mt-0.5 shrink-0"
                >
                  {selectedIds.has(c.id) ? <CheckSquare size={18} className="text-indigo-600" /> : <Square size={18} />}
                </button>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                  style={{ backgroundColor: c.is_active ? (c.primary_color || '#4F46E5') : '#94A3B8' }}
                >
                  <Building2 size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900 text-sm">{c.name}</h3>
                    {getTypeBadge(c.type_epci)}
                    <span className={c.is_active ? 'badge-green' : 'badge-gray'}>
                      {c.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                    <span>/{c.slug}</span>
                    {c.department_code && (
                      <span className="flex items-center gap-0.5">
                        <MapPin size={10} /> {c.department_code} - {c.department_name}
                      </span>
                    )}
                    {c.region && <span>{c.region}</span>}
                    {c.population ? (
                      <span className="flex items-center gap-0.5">
                        <Users size={10} /> {formatPopulation(c.population)} hab.
                      </span>
                    ) : null}
                    {c.siren && <span>SIREN: {c.siren}</span>}
                  </div>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {getPlanBadge(c.plan)}
                    <span className="text-[10px] text-slate-400">
                      Max {c.max_admins} admins - {c.max_news} articles
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(c.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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
            &larr; Precedent
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
                {editingId ? 'Modifier l\'intercommunalite' : 'Nouvelle intercommunalite'}
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
        title="Supprimer l'intercommunalite"
        message="Cette action supprimera l'intercommunalite et toutes ses donnees associees. Cette action est irreversible."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteCommune(deleteId).then(load)
          setDeleteId(null)
        }}
      />
    </AdminLayout>
  )
}
