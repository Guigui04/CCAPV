import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, ExternalLink, CheckCircle, Clock, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getNewsById } from '../lib/newsService'
import { submitFeedback } from '../lib/feedbackService'
import { getCategoryById, getTabBySubcategoryId, REACTION_LABELS } from '../constants'
import { useAuth } from '../context/AuthContext'
import { formatDate, cn } from '../utils'
import MarkdownContent from '../components/MarkdownContent'

const REACTIONS = Object.entries(REACTION_LABELS)

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [article, setArticle] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedReaction, setSelectedReaction] = useState('')
  const [fbComment, setFbComment] = useState('')
  const [fbSent, setFbSent] = useState(false)
  const [fbLoading, setFbLoading] = useState(false)
  const [fbError, setFbError] = useState('')
  const [shared, setShared] = useState(false)

  useEffect(() => {
    if (id) {
      setLoading(true)
      setNotFound(false)
      getNewsById(id)
        .then((data) => {
          if (data) setArticle(data)
          else setNotFound(true)
        })
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false))
    }
  }, [id])

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article?.title,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch {
      // User cancelled share
    }
  }

  async function handleFeedback(e: React.FormEvent) {
    e.preventDefault()
    const lastSent = sessionStorage.getItem('fb_last_sent')
    if (lastSent && Date.now() - Number(lastSent) < 30000) {
      setFbError('Attends quelques secondes avant de renvoyer un avis.')
      return
    }
    if (!selectedReaction) {
      setFbError('Choisis une réaction')
      return
    }
    if (!user) {
      setFbError('Tu dois être connecté pour donner ton avis')
      return
    }
    setFbLoading(true)
    setFbError('')
    try {
      await submitFeedback({
        news_id: id!,
        user_id: user.id,
        commune_id: profile?.commune_id || undefined,
        reaction: selectedReaction,
        comment: fbComment || undefined,
      })
      sessionStorage.setItem('fb_last_sent', String(Date.now()))
      setFbSent(true)
    } catch (err: any) {
      setFbError(err.message || "Erreur lors de l'envoi")
    } finally {
      setFbLoading(false)
    }
  }

  const cat = article ? getCategoryById(article.category_id) : null
  const parentTab = article ? getTabBySubcategoryId(article.category_id) : null

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-32" />
            <div className="h-64 bg-slate-200 rounded-3xl" />
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
          </div>
        ) : !notFound && article ? (
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-5 text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Retour
            </button>

            {/* Category + date header */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {parentTab && (
                <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full text-white', parentTab.color)}>
                  {parentTab.icon} {parentTab.label}
                </span>
              )}
              {cat && (
                <span className="badge-blue text-xs">
                  {cat.label}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mb-3 leading-tight">
              {article.title}
            </h1>

            {/* Meta row */}
            <div className="flex items-center gap-4 mb-6 text-slate-400 text-xs">
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {formatDate(article.created_at)}
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
              >
                <Share2 size={13} />
                {shared ? 'Lien copié !' : 'Partager'}
              </button>
            </div>

            {/* Hero image */}
            {article.image_url && (
              <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
                <img
                  src={article.image_url}
                  alt={article.title}
                  loading="eager"
                  className="w-full h-48 sm:h-72 object-cover"
                />
              </div>
            )}

            {/* Summary */}
            {article.summary && (
              <div className="bg-indigo-50 rounded-2xl p-5 mb-8 border border-indigo-100">
                <p className="text-indigo-900 font-medium text-base leading-relaxed">
                  {article.summary}
                </p>
              </div>
            )}

            {/* Content */}
            {article.content && (
              <div className="text-base mb-12">
                <MarkdownContent content={article.content} />
              </div>
            )}

            {/* Links */}
            {article.links && article.links.length > 0 && (
              <div className="mb-12">
                <h3 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">
                  Liens utiles
                </h3>
                <div className="space-y-2">
                  {article.links.map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
                    >
                      <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                        <ExternalLink size={16} className="text-indigo-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {link.label || link.url}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-display font-bold text-lg text-slate-900 mb-1">
                Ton avis nous intéresse
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                Dis-nous ce que tu penses de cet article.
              </p>

              {fbSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100"
                >
                  <CheckCircle className="text-green-600 shrink-0" size={24} />
                  <div>
                    <p className="text-green-700 font-bold text-sm">Merci pour ton retour !</p>
                    <p className="text-green-600 text-xs mt-0.5">
                      Ton avis a bien été enregistré.
                    </p>
                  </div>
                </motion.div>
              ) : !user ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 text-sm mb-4">
                    Connecte-toi pour donner ton avis.
                  </p>
                  <Link
                    to="/login"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Se connecter
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleFeedback} className="space-y-4">
                  {/* Reaction buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {REACTIONS.map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedReaction(key)}
                        className={cn(
                          'p-3 rounded-2xl border-2 text-sm font-medium transition-all text-center',
                          selectedReaction === key
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Optional comment */}
                  <textarea
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Un commentaire ? (optionnel)"
                    value={fbComment}
                    onChange={(e) => setFbComment(e.target.value)}
                  />

                  {fbError && (
                    <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">
                      {fbError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={fbLoading || !selectedReaction}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {fbLoading ? 'Envoi en cours...' : 'Envoyer mon avis'}
                  </button>
                </form>
              )}
            </div>
          </motion.article>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="font-display font-bold text-xl text-slate-900 mb-2">
              Article introuvable
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Cet article n'existe plus ou l'URL est incorrecte.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft size={16} />
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
