import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { getAllNews, createNews, updateNews, deleteNews, togglePublished, CATEGORIES } from '../../lib/newsService'

const EMPTY_FORM = { title: '', excerpt: '', content: '', category: 'news', image_url: '', published: false }

function Modal({ article, onClose, onSave }) {
  const [form, setForm] = useState(article ?? EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await onSave(form)
      onClose()
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-display font-bold text-lg text-brand-900">
            {article?.id ? 'Modifier l\'article' : 'Nouvel article'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Titre *</label>
            <input className="input-field" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Catégorie</label>
            <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Résumé</label>
            <textarea className="input-field resize-none" rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contenu</label>
            <textarea className="input-field resize-none" rows={6} value={form.content} onChange={e => set('content', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">URL de l'image</label>
            <input className="input-field" type="url" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="w-4 h-4 accent-brand-600" />
            <span className="text-sm font-medium text-slate-700">Publier immédiatement</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminNews() {
  const [articles, setArticles] = useState([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null) // null | 'new' | article object
  const LIMIT = 20

  const load = useCallback(() => {
    setLoading(true)
    getAllNews({ page, limit: LIMIT })
      .then(({ data, count }) => { setArticles(data ?? []); setTotal(count ?? 0) })
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { load() }, [load])

  async function handleSave(form) {
    if (modal?.id) await updateNews(modal.id, form)
    else await createNews(form)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cet article ?')) return
    await deleteNews(id)
    load()
  }

  async function handleToggle(id, published) {
    await togglePublished(id, !published)
    load()
  }

  const totalPages = Math.ceil(total / LIMIT)
  const cat = id => CATEGORIES.find(c => c.id === id)

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-brand-900">Articles</h2>
          <p className="text-slate-500 text-sm">{total} article{total !== 1 ? 's' : ''} au total</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary">+ Nouvel article</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
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
                <th className="px-4 py-3 text-slate-500 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-brand-900 max-w-xs truncate">{a.title}</td>
                  <td className="px-4 py-3">
                    <span className="badge-blue">{cat(a.category)?.icon} {cat(a.category)?.label ?? a.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(a.id, a.published)}>
                      <span className={a.published ? 'badge-green' : 'badge-gray'}>
                        {a.published ? '✓ Publié' : '○ Brouillon'}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(a.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setModal(a)} className="btn-secondary btn-sm text-xs">Modifier</button>
                      <button onClick={() => handleDelete(a.id)} className="btn-danger btn-sm text-xs">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {articles.length === 0 && (
            <div className="text-center py-12 text-slate-400">Aucun article</div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary btn-sm disabled:opacity-40">← Précédent</button>
          <span className="text-sm text-slate-500 px-2">Page {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary btn-sm disabled:opacity-40">Suivant →</button>
        </div>
      )}

      {modal && (
        <Modal
          article={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  )
}
