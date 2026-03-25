import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  togglePublished,
} from '../../lib/newsService'
import { TABS, getCategoryById } from '../../constants'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/AdminLayout'

const EMPTY = {
  title: '',
  summary: '',
  content: '',
  category_id: 'parcours-scolaires',
  image_url: '',
  status: 'draft',
}

export default function AdminNews() {
  const [articles, setArticles] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<any | null | false>(false)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
    if (!form.title.trim()) {
      alert('Le titre est obligatoire')
      return
    }
    if (!form.content.trim()) {
      alert('Le contenu est obligatoire')
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        summary: form.summary,
        content: form.content,
        category_id: form.category_id,
        image_url: form.image_url,
        status: form.status,
      }
      if (modal?.id) {
        await updateNews(modal.id, payload)
      } else {
        await createNews(payload)
      }
      setModal(false)
      load()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Seules les images sont acceptees')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image trop lourde (max 5 Mo)')
      return
    }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `news/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('images').upload(path, file)
      if (error) throw error
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(path)
      setForm((f: any) => ({ ...f, image_url: urlData.publicUrl }))
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'upload")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-xl lg:text-2xl text-slate-900">
          Articles ({total})
        </h2>
        <button onClick={() => openModal(null)} className="btn-primary text-sm">
          + Nouvel article
        </button>
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
                  <th className="px-4 py-3 text-slate-500 font-medium">Titre</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Categorie</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Statut</th>
                  <th className="px-4 py-3 text-slate-500 font-medium">Date</th>
                  <th className="px-4 py-3 text-slate-500 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => {
                  const cat = getCategoryById(a.category_id)
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
                          {cat?.tabIcon} {cat?.label ?? a.category_id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            togglePublished(a.id, a.status).then(load)
                          }
                        >
                          <span
                            className={
                              a.status === 'published' ? 'badge-green' : 'badge-gray'
                            }
                          >
                            {a.status === 'published' ? '✓ Publie' : '○ Brouillon'}
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
              <div className="text-center py-12">
                <p className="text-slate-400 mb-3">Aucun article</p>
                <button onClick={() => openModal(null)} className="btn-primary text-sm">
                  + Creer le premier article
                </button>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {articles.length === 0 && (
              <div className="card p-12 text-center text-slate-400">
                Aucun article
              </div>
            )}
            {articles.map((a) => {
              const cat = getCategoryById(a.category_id)
              return (
                <div key={a.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 flex-1">
                      {a.title}
                    </h3>
                    <button
                      onClick={() => togglePublished(a.id, a.status).then(load)}
                      className="shrink-0"
                    >
                      <span
                        className={
                          a.status === 'published' ? 'badge-green' : 'badge-gray'
                        }
                      >
                        {a.status === 'published' ? '✓ Publie' : '○ Brouillon'}
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="badge-blue text-xs">
                      {cat?.tabIcon} {cat?.label ?? a.category_id}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(a.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(a)}
                      className="btn-secondary btn-sm text-xs flex-1"
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
                </div>
              )
            })}
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

      {/* Modal - full screen on mobile, centered on desktop */}
      {modal !== false && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end lg:items-center justify-center lg:p-4">
          <div className="bg-white w-full lg:rounded-2xl lg:shadow-xl lg:max-w-2xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto rounded-t-2xl">
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="font-display font-bold text-lg text-slate-900">
                {modal?.id ? 'Modifier l\'article' : 'Nouvel article'}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="p-4 lg:p-6 space-y-4">
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
                  Categorie
                </label>
                <select
                  className="input-field"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm((f: any) => ({ ...f, category_id: e.target.value }))
                  }
                >
                  {TABS.map((tab) => (
                    <optgroup key={tab.id} label={`${tab.icon} ${tab.label}`}>
                      {tab.subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Resume
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={2}
                  value={form.summary}
                  onChange={(e) =>
                    setForm((f: any) => ({ ...f, summary: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Contenu
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={6}
                  value={form.content}
                  onChange={(e) =>
                    setForm((f: any) => ({ ...f, content: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Image
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      className="input-field flex-1"
                      type="url"
                      placeholder="URL de l'image ou uploader ci-dessous"
                      value={form.image_url}
                      onChange={(e) =>
                        setForm((f: any) => ({ ...f, image_url: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="btn-secondary text-sm whitespace-nowrap"
                    >
                      {uploading ? 'Upload...' : 'Uploader'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {form.image_url && (
                    <div className="relative">
                      <img
                        src={form.image_url}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-xl border border-slate-200"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => setForm((f: any) => ({ ...f, image_url: '' }))}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.status === 'published'}
                  onChange={(e) =>
                    setForm((f: any) => ({ ...f, status: e.target.checked ? 'published' : 'draft' }))
                  }
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <span className="text-sm font-medium text-slate-700">
                  Publier immediatement
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
