import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { User, Shield, Search, ChevronDown } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import { useToast } from '../../components/Toast'
import { cn, formatDate } from '../../utils'

const ROLES = [
  { value: 'user', label: 'Utilisateur', color: 'badge-gray' },
  { value: 'commune_admin', label: 'Admin commune', color: 'badge-blue' },
  { value: 'super_admin', label: 'Super admin', color: 'badge-red' },
]

export default function AdminUsers() {
  const toast = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [editingRole, setEditingRole] = useState<string | null>(null)
  const LIMIT = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * LIMIT, page * LIMIT - 1)

      if (roleFilter) {
        query = query.eq('role', roleFilter)
      }
      if (search.trim()) {
        query = query.or(`first_name.ilike.%${search.trim()}%,last_name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`)
      }

      const { data, count, error } = await query
      if (error) throw error
      setUsers(data ?? [])
      setTotal(count ?? 0)
    } catch {
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }, [page, roleFilter, search])

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [load])

  async function handleRoleChange(userId: string, newRole: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
      if (error) throw error
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
      setEditingRole(null)
      toast.success('Rôle modifié')
    } catch {
      toast.error('Erreur lors de la modification du rôle')
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  function getName(u: any) {
    const name = `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim()
    return name || 'Sans nom'
  }

  function getRoleBadge(role: string) {
    const r = ROLES.find((x) => x.value === role) ?? ROLES[0]
    return <span className={r.color}>{r.label}</span>
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display font-bold text-xl lg:text-2xl text-slate-900">
          Utilisateurs ({total})
        </h2>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Rechercher par nom ou email..."
            className="input-field pl-9"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          className="input-field w-full sm:w-48"
        >
          <option value="">Tous les rôles</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-4 py-3 text-slate-500 font-medium">Utilisateur</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Email</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Rôle</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Inscrit le</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 shrink-0">
                          <User size={14} />
                        </div>
                        <span className="font-medium text-slate-900">{getName(u)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.email || '—'}</td>
                    <td className="px-4 py-3">
                      {editingRole === u.id ? (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          onBlur={() => setEditingRole(null)}
                          autoFocus
                          className="input-field py-1 text-xs w-40"
                        >
                          {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      ) : (
                        <button onClick={() => setEditingRole(u.id)} className="hover:opacity-70 transition-opacity">
                          {getRoleBadge(u.role)}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={u.is_active !== false ? 'badge-green' : 'badge-gray'}>
                        {u.is_active !== false ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                Aucun utilisateur trouvé
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {users.length === 0 && (
              <div className="card p-12 text-center text-slate-400">
                Aucun utilisateur trouvé
              </div>
            )}
            {users.map((u) => (
              <div key={u.id} className="card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 shrink-0">
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{getName(u)}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email || '—'}</p>
                  </div>
                  <span className={u.is_active !== false ? 'badge-green' : 'badge-gray'}>
                    {u.is_active !== false ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {editingRole === u.id ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        onBlur={() => setEditingRole(null)}
                        autoFocus
                        className="input-field py-1 text-xs"
                      >
                        {ROLES.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    ) : (
                      <button onClick={() => setEditingRole(u.id)} className="flex items-center gap-1">
                        {getRoleBadge(u.role)}
                        <ChevronDown size={12} className="text-slate-400" />
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {formatDate(u.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
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
