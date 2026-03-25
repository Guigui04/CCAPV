import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import {
  LogOut,
  User,
  Mail,
  Calendar,
  Shield,
  ChevronRight,
  Settings,
  Bell,
  ShieldCheck,
  HelpCircle,
  Pencil,
  Check,
  X,
} from 'lucide-react'
import { cn, formatDate } from '../utils'

export default function ProfilPage() {
  const { user, profile, isAdmin, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState(profile?.first_name ?? '')
  const [lastName, setLastName] = useState(profile?.last_name ?? '')
  const [birthDate, setBirthDate] = useState(profile?.birth_date ?? '')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function handleLogout() {
    try {
      await logout()
      navigate('/')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  function startEdit() {
    setFirstName(profile?.first_name ?? '')
    setLastName(profile?.last_name ?? '')
    setBirthDate(profile?.birth_date ?? '')
    setSaveError('')
    setEditing(true)
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    try {
      await updateProfile({
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        birth_date: birthDate || undefined,
      })
      setEditing(false)
    } catch (err: any) {
      setSaveError(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  const displayName = profile
    ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || 'Utilisateur'
    : 'Utilisateur'

  const menuItems = [
    {
      icon: Bell,
      label: 'Préférences de notification',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      to: '/alertes',
    },
    {
      icon: ShieldCheck,
      label: 'Confidentialité',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      to: null,
    },
    {
      icon: HelpCircle,
      label: 'Aide & contact',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      to: null,
    },
    {
      icon: Settings,
      label: 'Paramètres',
      color: 'text-slate-500',
      bg: 'bg-slate-50',
      to: null,
    },
  ]

  return (
    <div className="space-y-8 pb-8">
      {/* Avatar + name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-4"
      >
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4 border-4 border-white shadow-lg">
          <User size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
          {displayName}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
              isAdmin
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-200 text-slate-600'
            )}
          >
            {isAdmin ? 'Administrateur' : 'Utilisateur'}
          </span>
        </div>
      </motion.div>

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Informations
          </h3>
          {!editing ? (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Pencil size={14} />
              Modifier
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={14} />
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
              >
                <Check size={14} />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          )}
        </div>

        {saveError && (
          <div className="mx-6 mt-2 p-3 bg-red-50 rounded-xl border border-red-100 text-red-600 text-xs font-medium">
            {saveError}
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Email (read-only) */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Email
              </p>
              <p className="font-bold text-slate-700 text-sm">
                {user.email ?? 'Non renseigné'}
              </p>
            </div>
          </div>

          {/* First name */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Prénom
              </p>
              {editing ? (
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Ton prénom"
                />
              ) : (
                <p className="font-bold text-slate-700 text-sm">
                  {profile?.first_name || 'Non renseigné'}
                </p>
              )}
            </div>
          </div>

          {/* Last name */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <User size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Nom
              </p>
              {editing ? (
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Ton nom"
                />
              ) : (
                <p className="font-bold text-slate-700 text-sm">
                  {profile?.last_name || 'Non renseigné'}
                </p>
              )}
            </div>
          </div>

          {/* Birth date */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Date de naissance
              </p>
              {editing ? (
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              ) : (
                <p className="font-bold text-slate-700 text-sm">
                  {profile?.birth_date ? formatDate(profile.birth_date) : 'Non renseigné'}
                </p>
              )}
            </div>
          </div>

          {/* Role (read-only) */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Rôle
              </p>
              <p className="font-bold text-slate-700 text-sm">
                {isAdmin ? 'Administrateur' : 'Jeune 11-30 ans'}
              </p>
            </div>
          </div>

          {/* Member since (read-only) */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Membre depuis
              </p>
              <p className="font-bold text-slate-700 text-sm">
                {formatDate(user.created_at)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Menu items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => item.to && navigate(item.to)}
            className={cn(
              'w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 transition-all group',
              item.to
                ? 'hover:bg-slate-50 cursor-pointer'
                : 'opacity-60 cursor-not-allowed'
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  item.bg,
                  item.color
                )}
              >
                <item.icon size={20} />
              </div>
              <span className="font-bold text-slate-700 text-sm">{item.label}</span>
              {!item.to && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Bientôt
                </span>
              )}
            </div>
            <ChevronRight
              size={18}
              className="text-slate-300 group-hover:text-slate-500 transition-colors"
            />
          </button>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleLogout}
        className="w-full py-4 bg-white text-red-500 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border-2 border-red-50 hover:bg-red-50 transition-all"
      >
        Se déconnecter
        <LogOut size={18} />
      </motion.button>

      <p className="text-center text-slate-400 text-[10px] font-medium uppercase tracking-widest">
        Version 1.0.0 · Communauté de Communes
      </p>
    </div>
  )
}
