import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getNewsById, CATEGORIES } from '../lib/newsService'
import { submitFeedback } from '../lib/feedbackService'
import { useAuth } from '../context/AuthContext'

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fbContent, setFbContent] = useState('')
  const [fbEmail, setFbEmail] = useState(user?.email ?? '')
  const [fbSent, setFbSent] = useState(false)
  const [fbLoading, setFbLoading] = useState(false)

  useEffect(() => {
    if (id) getNewsById(id).then(setArticle).finally(() => setLoading(false))
  }, [id])

  async function handleFeedback(e: React.FormEvent) {
    e.preventDefault(); setFbLoading(true)
    try { await submitFeedback({ news_id: id!, author_email: fbEmail, content: fbContent }); setFbSent(true) }
    catch (err: any) { alert(err.message) }
    finally { setFbLoading(false) }
  }

  const cat = article ? CATEGORIES.find(c => c.id === article.category) : null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <Link to="/" className="font-display font-bold text-blue-900 text-lg">CC Alpes Provence Verdon</Link>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/" className="text-blue-600 hover:underline text-sm font-medium mb-6 block">← Retour</Link>
        {loading ? <div className="flex justify-center py-24"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div> : article ? (
          <>
            {article.image_url && <img src={article.image_url} alt={article.title} className="w-full h-64 object-cover rounded-2xl mb-8" />}
            <div className="flex items-center gap-2 mb-4">
              {cat && <span className="badge-blue">{cat.icon} {cat.label}</span>}
              <span className="text-xs text-slate-400">{new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-blue-900 mb-4">{article.title}</h1>
            {article.excerpt && <p className="text-lg text-slate-600 border-l-4 border-blue-400 pl-4 mb-6">{article.excerpt}</p>}
            {article.content && <div className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-12">{article.content}</div>}
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-blue-900 mb-4">💬 Laisser un commentaire</h2>
              {fbSent ? <p className="text-green-600 font-medium">✅ Merci ! Votre commentaire est en attente de modération.</p> : (
                <form onSubmit={handleFeedback} className="space-y-3">
                  <input type="email" className="input-field" placeholder="Votre email" value={fbEmail} onChange={e => setFbEmail(e.target.value)} required />
                  <textarea className="input-field resize-none" rows={4} placeholder="Votre commentaire…" value={fbContent} onChange={e => setFbContent(e.target.value)} required />
                  <button type="submit" disabled={fbLoading} className="btn-primary">{fbLoading ? 'Envoi…' : 'Envoyer'}</button>
                </form>
              )}
            </div>
          </>
        ) : <p className="text-center text-red-600 py-12">Article introuvable</p>}
      </div>
    </div>
  )
}
