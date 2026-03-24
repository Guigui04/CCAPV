import { useState, useEffect, useCallback } from 'react'
import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  togglePublished,
} from '../../lib/newsService'
import { CATEGORIES, getCategoryById } from '../../constants'
import AdminLayout from '../../components/AdminLayout'

const EMPTY = {
  title: '',
  excerpt: '',
  content: '',
  category: 'sante',
  image_url: '',
  published: false,
}

export default function AdminNews() {
  const [articles, setArticles] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<any | null | false>(false)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)
  const LIMIT = 20

  const load = useCallback(() => {
    setLoading(true)
    getAllNews({ page, limit: LIMIT })
      .then(({ data, count }) => {
        setArticles(data)
        setTotal(count)
      })
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    load()
  }, [load])

  function openModal(a: any | null) {
    setModal(a)
    setForm(a ?? { ...EMPTY })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal?.id) {
        await updateNews(modal.id, form)
      } else {
        await createNews(form)
      }
      setModal(false)
      load()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-2xl text-slate-900">
          Articles ({total})
        </h2>
        <button onClick={() => openModal(null)} className="btn-primary">
          + Nouvel article
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-4 py-3 text-slate-500 font-medium">Titre</th>
                <th className="px-4 py-3 text-slate-500 font-medium">Catégorie</th>
                <th className="px-4 py-3 text-slate-500 font-medium">Statut</th>
                <th className="px-4 py-3 text-slate-500 font-medium">Date</th>
                <th className="px-4 py-3 text-slate-500 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => {
                const cat = getCategoryById(a.category)
                return (
                  <tr
                    key={a.id}
                    className="border-b border-slate-50 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">
                      {a.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-blue">
                        {cat?.icon} {cat?.label ?? a.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          togglePublished(a.id, !a.published).then(load)
                        }
                      >
                        <span
                          className={
                            a.published ? 'badge-green' : 'badge-gray'
                          }
                        >
                          {a.published ? '✓ Publié' : '○ Brouillon'}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(a.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(a)}
                          className="btn-secondary btn-sm text-xs"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Supprimer cet article ?'))
                              deleteNews(a.id).then(load)
                          }}
                          className="btn-danger btn-sm text-xs"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {articles.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              Aucun article
            </div>
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

      {/* Modal */}
      {modal !== false && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-display font-bold text-lg text-slate-900">
                {modal?.id ? 'Modifier l\'article' : 'Nouvel article'}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Titre *
                </label>
                <input
                  className="input-field"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f: any) => ({ ...f, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Catégorie
                </label>
                <select
                  className="input-field"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f: any) => ({ ...f, category: e.target.value }))
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Résumé
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((f: any) => ({ ...f, excerpt: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Contenu
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={8}
                  value={form.content}
                  onChange={(e) =>
                    setForm((f: any) => ({ ...f, content: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  URL image
                </label>
                <input
                  className="input-field"
                  type="url"
                  value={form.image_url}
                  onChange={(e) =>
                    setForm((f: any) => ({ ...f, image_url: e.target.value }))
                  }
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    setForm((f: any) => ({ ...f, published: e.target.checked }))
                  }
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <span className="text-sm font-medium text-slate-700">
                  Publier immédiatement
                </span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
