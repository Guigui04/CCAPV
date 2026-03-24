import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Info, Calendar, Star, ArrowRight, BellRing, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils'

// For now, notifications are local/mock since we don't have a notifications table yet.
// This page serves as a placeholder that shows category subscription preferences.
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'info',
    title: 'Nouveau dispositif Mobilité',
    message:
      'La communauté de communes lance une aide au permis de conduire pour les 18-25 ans.',
    time: 'Il y a 2h',
    read: false,
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    id: '2',
    type: 'event',
    title: 'Forum Emploi Jeunes',
    message:
      'Rendez-vous samedi prochain à la salle des fêtes pour rencontrer les entreprises locales.',
    time: 'Hier',
    read: true,
    icon: Calendar,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    id: '3',
    type: 'featured',
    title: 'À ne pas manquer',
    message:
      "Les inscriptions pour les ateliers culturels d'été sont ouvertes !",
    time: 'Il y a 2 jours',
    read: true,
    icon: Star,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
]

export default function AlertesPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [allRead, setAllRead] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setAllRead(true)
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
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
            onClick={markAllRead}
            className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:text-indigo-800 transition-colors flex items-center gap-1"
          >
            <Check size={14} />
            Tout marquer lu
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif, i) => {
          const Icon = notif.icon
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => markRead(notif.id)}
              className={cn(
                'p-4 rounded-3xl border transition-all flex gap-4 group cursor-pointer',
                notif.read
                  ? 'bg-white border-slate-100'
                  : 'bg-indigo-50/30 border-indigo-100 shadow-sm ring-1 ring-indigo-100'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
                  notif.bg,
                  notif.color
                )}
              >
                <Icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={cn(
                      'font-bold truncate',
                      notif.read ? 'text-slate-700' : 'text-slate-900'
                    )}
                  >
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shrink-0 ml-2" />
                  )}
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                  {notif.message}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {notif.time}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {notifications.length > 0 && allRead && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-slate-400 text-sm font-medium">
            ✨ Vous êtes à jour !
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
