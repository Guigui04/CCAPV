import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ArrowRight, BellRing, Check, Megaphone } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  getNotifications,
  getReadNotificationIds,
  markNotificationRead,
  markAllNotificationsRead,
} from '../lib/notificationService'
import { cn, formatRelativeDate } from '../utils'

export default function AlertesPage() {
  const { user, profile } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || !profile?.commune_id) {
      setLoading(false)
      return
    }
    async function load() {
      try {
        const [notifs, reads] = await Promise.all([
          getNotifications(profile!.commune_id!),
          getReadNotificationIds(user!.id),
        ])
        setNotifications(notifs)
        setReadIds(reads)
      } catch {
        setError('Impossible de charger les alertes.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, profile])

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length

  async function handleMarkRead(id: string) {
    if (readIds.has(id) || !user) return
    setReadIds((prev) => new Set(prev).add(id))
    try {
      await markNotificationRead(user.id, id)
    } catch {
      // Revert on error
      setReadIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  async function handleMarkAllRead() {
    if (!user) return
    const unreadIds = notifications.filter((n) => !readIds.has(n.id)).map((n) => n.id)
    if (unreadIds.length === 0) return
    setReadIds((prev) => {
      const next = new Set(prev)
      unreadIds.forEach((id) => next.add(id))
      return next
    })
    try {
      await markAllNotificationsRead(user.id, unreadIds)
    } catch {
      // reload on error
    }
  }

  if (!user) {
    return (
      <div className="space-y-6 pb-8">
        <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
          Alertes
        </h2>
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 mx-auto mb-4">
            <BellRing size={32} />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
            Reste informé
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
            Connecte-toi pour recevoir des alertes personnalisées sur les sujets qui
            t'intéressent.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Se connecter
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
          Alertes
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:text-indigo-800 transition-colors flex items-center gap-1"
          >
            <Check size={14} />
            Tout marquer lu
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-medium text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
            <Bell size={32} />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
            Aucune alerte
          </h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Tu recevras ici les nouvelles de ta communauté de communes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, i) => {
            const isRead = readIds.has(notif.id)
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleMarkRead(notif.id)}
                className={cn(
                  'p-4 rounded-3xl border transition-all flex gap-4 group cursor-pointer',
                  isRead
                    ? 'bg-white border-slate-100'
                    : 'bg-indigo-50/30 border-indigo-100 shadow-sm ring-1 ring-indigo-100'
                )}
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
                    isRead ? 'bg-slate-50 text-slate-400' : 'bg-indigo-50 text-indigo-500'
                  )}
                >
                  <Megaphone size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={cn(
                        'font-bold truncate',
                        isRead ? 'text-slate-700' : 'text-slate-900'
                      )}
                    >
                      {notif.title}
                    </h4>
                    {!isRead && (
                      <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                    {notif.body}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {notif.sent_at ? formatRelativeDate(notif.sent_at) : ''}
                    </span>
                    {notif.news_id && (
                      <Link
                        to={`/news/${notif.news_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                      >
                        Voir l'article <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {notifications.length > 0 && unreadCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6"
        >
          <p className="text-slate-400 text-sm font-medium">
            Tu es à jour !
          </p>
        </motion.div>
      )}

      {/* Subscription preferences teaser */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <Bell size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Préférences d'alertes</h4>
            <p className="text-slate-500 text-xs">
              Bientôt : choisis les catégories qui t'intéressent
            </p>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">
          Cette fonctionnalité arrive bientôt. Tu pourras choisir de recevoir des
          notifications pour l'emploi, le logement, les événements et plus encore.
        </p>
      </div>
    </div>
  )
}
