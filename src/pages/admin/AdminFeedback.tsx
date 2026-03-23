import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getFeedbacks, updateFeedbackStatus, deleteFeedback } from '../../lib/feedbackService'

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const LIMIT = 20

  const load = useCallback(() => {
    setLoading(true)
    getFeedbacks({ status, page, limit: LIMIT }).then(({ data, count }) => { setFeedbacks(data ?? []); setTotal(count ?? 0) }).finally(() => setLoading(false))
  }, [status, page])

  useEffect(() => { load() }, [load])

  const totalPages = Math.ceil(total / LIMIT)
  const statusBadge = (s: string) => s === 'approved' ? <span className="badge-green">✅ Approuvé</span> : s === 'rejected' ? <span className="badge-red">❌ Rejeté</span> : <span className="badge-yellow">⏳ En attente</span>

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-blue-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-blue-700"><Link to="/" className="font-display font-bold text-sm">CC Alpes Provence Verdon</Link><p className="text-blue-400 text-xs mt-1 uppercase tracking-wide">Administration</p></div>
        <nav className="flex-1 p-3 space-y-1">
          {[{to:'/admin',label:'Dashboard',icon:'📊'},{to:'/admin/news',label:'Articles',icon:'📝'},{to:'/admin/feedback',label:'Feedbacks',icon:'💬'}].map(n => (
            <Link key={n.to} to={n.to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-200 hover:bg-blue-800 hover:text-white transition-all">{n.icon} {n.label}</Link>
          ))}
        </nav>
        <div className="p-3 border-t border-blue-700"><Link to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-blue-300 hover:text-white">← Site public</Link></div>
      </aside>
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="font-display font-bold text-2xl text-blue-900 mb-6">Feedbacks ({total})</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {[{value:'',label:'Tous'},{value:'pending',label:'⏳ En attente'},{value:'approved',label:'✅ Approuvés'},{value:'rejected',label:'❌ Rejetés'}].map(f => (
            <button key={f.value} onClick={() => { setStatus(f.value); setPage(1) }} className={`badge text-sm px-3 py-1.5 cursor-pointer ${status===f.value ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>{f.label}</button>
          ))}
        </div>
        {loading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div> : (
          <div className="space-y-3">
            {feedbacks.length === 0 && <div className="card p-12 text-center text-slate-400">Aucun feedback</div>}
            {feedbacks.map(f => (
              <div key={f.id} className="card p-5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">{statusBadge(f.status)}<span className="text-xs text-slate-400">{f.author_email}</span>{f.news?.title && <span className="text-xs text-slate-400">· {f.news.title}</span>}<span className="text-xs text-slate-300 ml-auto">{new Date(f.created_at).toLocaleDateString('fr-FR')}</span></div>
                <p className="text-slate-700 text-sm">{f.content}</p>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
                  {f.status !== 'approved' && <button onClick={() => updateFeedbackStatus(f.id, 'approved').then(load)} className="btn-secondary btn-sm text-xs text-green-700">✅ Approuver</button>}
                  {f.status !== 'rejected' && <button onClick={() => updateFeedbackStatus(f.id, 'rejected').then(load)} className="btn-secondary btn-sm text-xs text-yellow-700">❌ Rejeter</button>}
                  <button onClick={() => { if(confirm('Supprimer ?')) deleteFeedback(f.id).then(load) }} className="btn-danger btn-sm text-xs ml-auto">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {totalPages > 1 && <div className="flex items-center justify-center gap-2 mt-6"><button disabled={page===1} onClick={() => setPage(p=>p-1)} className="btn-secondary btn-sm disabled:opacity-40">← Précédent</button><span className="text-sm text-slate-500">Page {page}/{totalPages}</span><button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} className="btn-secondary btn-sm disabled:opacity-40">Suivant →</button></div>}
      </div>
    </div>
  )
}
