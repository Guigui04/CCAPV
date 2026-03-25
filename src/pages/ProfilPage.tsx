import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import {
  LogOut,
  User,
  Mail,
  Calendar,
  Shield,
  ChevronRight,
  Pencil,
  Check,
  X,
  Lock,
  MapPin,
  Trash2,
  LayoutDashboard,
  Eye,
  EyeOff,
  Settings,
  Heart,
} from 'lucide-react'
import { cn, formatDate } from '../utils'
import { TABS } from '../constants'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../components/Toast'

export default function ProfilPage() {
  const { user, profile, isAdmin, logout, updateProfile, changePassword, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  // Edit personal info
  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState(profile?.first_name ?? '')
  const [lastName, setLastName] = useState(profile?.last_name ?? '')
  const [birthDate, setBirthDate] = useState(profile?.birth_date ?? '')
  const [saving, setSaving] = useState(false)

  // Commune
  const [communes, setCommunes] = useState<{ id: string; name: string }[]>([])
  const [selectedCommune, setSelectedCommune] = useState(profile?.commune_id ?? '')
  const [savingCommune, setSavingCommune] = useState(false)

  // Password
  const [showPwd, setShowPwd] = useState(false)
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdVisible, setPwdVisible] = useState(false)
  const [savingPwd, setSavingPwd] = useState(false)
  const [pwdMsg, setPwdMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Interests
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? [])

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Load communes
  useEffect(() => {
    supabase
      .from('communes')
      .select('id, name')
      .order('name')
      .then(({ data }) => {
        if (data) setCommunes(data)
      })
  }, [])

  // Sync profile changes
  useEffect(() => {
    setSelectedCommune(profile?.commune_id ?? '')
    setFirstName(profile?.first_name ?? '')
    setLastName(profile?.last_name ?? '')
    setBirthDate(profile?.birth_date ?? '')
    setInterests(profile?.interests ?? [])
  }, [profile])

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  function startEdit() {
    setFirstName(profile?.first_name ?? '')
    setLastName(profile?.last_name ?? '')
    setBirthDate(profile?.birth_date ?? '')
    setEditing(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateProfile({
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        birth_date: birthDate || undefined,
      })
      setEditing(false)
      toast.success('Profil mis à jour')
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  async function handleCommuneChange(communeId: string) {
    setSelectedCommune(communeId)
    setSavingCommune(true)
    try {
      await updateProfile({ commune_id: communeId || undefined } as any)
    } catch {
      setSelectedCommune(profile?.commune_id ?? '')
    } finally {
      setSavingCommune(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwdMsg(null)
    if (newPwd.length < 6) {
      setPwdMsg({ type: 'err', text: '6 caractères minimum' })
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: 'err', text: 'Les mots de passe ne correspondent pas' })
      return
    }
    setSavingPwd(true)
    try {
      await changePassword(newPwd)
      toast.success('Mot de passe modifié')
      setNewPwd('')
      setConfirmPwd('')
      setShowPwd(false)
    } catch (err: any) {
      setPwdMsg({ type: 'err', text: err.message || 'Erreur' })
    } finally {
      setSavingPwd(false)
    }
  }

  async function toggleInterest(tabId: string) {
    const next = interests.includes(tabId)
      ? interests.filter((i) => i !== tabId)
      : [...interests, tabId]
    setInterests(next)
    try {
      await updateProfile({ interests: next })
    } catch {
      setInterests(interests) // revert
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  async function handleDeleteAccount() {
    try {
      await deleteAccount()
      navigate('/')
    } catch {
      // ignore
    }
  }

  if (!user) return null

  const displayName = profile
    ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || 'Utilisateur'
    : 'Utilisateur'

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="space-y-6 pb-8">
      {/* Header avatar + name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-4"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-200 text-xl font-bold">
          {initials || <User size={36} strokeWidth={1.5} />}
        </div>
        <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">
          {displayName}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white flex items-center gap-1"
            >
              <LayoutDashboard size={10} />
              Admin
            </Link>
          )}
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
            Membre depuis {formatDate(user.created_at).split(' ').slice(1).join(' ')}
          </span>
        </div>
      </motion.div>

      {/* Section: Infos personnelles */}
      <Section title="Informations personnelles" icon={User} delay={0.05}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-400">Tes informations de base</p>
          {!editing ? (
            <button
              onClick={startEdit}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Pencil size={12} /> Modifier
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                <X size={12} /> Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-800 disabled:opacity-50"
              >
                <Check size={12} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <InfoRow icon={Mail} label="Email" value={user.email ?? 'Non renseigné'} />
          {editing ? (
            <>
              <EditRow icon={User} label="Prénom" value={firstName} onChange={setFirstName} placeholder="Ton prénom" />
              <EditRow icon={User} label="Nom" value={lastName} onChange={setLastName} placeholder="Ton nom" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date de naissance</p>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <InfoRow icon={User} label="Prénom" value={profile?.first_name || 'Non renseigné'} muted={!profile?.first_name} />
              <InfoRow icon={User} label="Nom" value={profile?.last_name || 'Non renseigné'} muted={!profile?.last_name} />
              <InfoRow icon={Calendar} label="Date de naissance" value={profile?.birth_date ? formatDate(profile.birth_date) : 'Non renseigné'} muted={!profile?.birth_date} />
            </>
          )}
          <InfoRow icon={Shield} label="Rôle" value={isAdmin ? 'Administrateur' : 'Utilisateur'} />
        </div>
      </Section>

      {/* Section: Ma commune */}
      <Section title="Ma commune" icon={MapPin} delay={0.1}>
        <p className="text-xs text-slate-400 mb-3">
          Sélectionne ta commune pour recevoir les alertes locales
        </p>
        <div className="relative">
          <select
            value={selectedCommune}
            onChange={(e) => handleCommuneChange(e.target.value)}
            disabled={savingCommune}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 appearance-none disabled:opacity-50"
          >
            <option value="">Aucune commune sélectionnée</option>
            {communes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
        </div>
        {savingCommune && (
          <p className="text-xs text-indigo-500 mt-2 font-medium">Enregistrement...</p>
        )}
      </Section>

      {/* Section: Centres d'intérêt */}
      <Section title="Centres d'intérêt" icon={Heart} delay={0.15}>
        <p className="text-xs text-slate-400 mb-3">
          Sélectionne les thématiques qui t'intéressent pour personnaliser ton expérience
        </p>
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const selected = interests.includes(tab.id)
            return (
              <button
                key={tab.id}
                onClick={() => toggleInterest(tab.id)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-bold transition-all border',
                  selected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                )}
              >
                {tab.icon} {tab.label}
              </button>
            )
          })}
        </div>
        {interests.length > 0 && (
          <p className="text-[10px] text-indigo-400 mt-3 font-medium">
            {interests.length} thématique{interests.length > 1 ? 's' : ''} sélectionnée{interests.length > 1 ? 's' : ''}
          </p>
        )}
      </Section>

      {/* Section: Sécurité */}
      <Section title="Sécurité" icon={Lock} delay={0.2}>
        {!showPwd ? (
          <button
            onClick={() => { setShowPwd(true); setPwdMsg(null) }}
            className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Changer le mot de passe</span>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
          </button>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="relative">
              <input
                type={pwdVisible ? 'text' : 'password'}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="Nouveau mot de passe"
                className="w-full px-4 py-3 pr-10 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={() => setPwdVisible(!pwdVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {pwdVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <input
              type={pwdVisible ? 'text' : 'password'}
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Confirmer le mot de passe"
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {pwdMsg && (
              <div
                className={cn(
                  'p-2.5 rounded-xl text-xs font-medium text-center',
                  pwdMsg.type === 'ok' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                )}
              >
                {pwdMsg.text}
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={savingPwd}
                className="btn-primary flex-1 text-sm"
              >
                {savingPwd ? 'Modification...' : 'Modifier'}
              </button>
              <button
                type="button"
                onClick={() => { setShowPwd(false); setNewPwd(''); setConfirmPwd('') }}
                className="btn-secondary text-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </Section>

      {/* Section: Paramètres */}
      <Section title="Paramètres" icon={Settings} delay={0.25}>
        <div className="space-y-1">
          {isAdmin && (
            <MenuButton
              icon={LayoutDashboard}
              label="Panel administration"
              sublabel="Gérer les articles, feedbacks, alertes"
              iconBg="bg-indigo-50"
              iconColor="text-indigo-500"
              onClick={() => navigate('/admin')}
            />
          )}
          <MenuButton
            icon={Shield}
            label="Politique de confidentialité"
            sublabel="Comment nous protégeons tes données"
            iconBg="bg-slate-50"
            iconColor="text-slate-400"
            onClick={() => {}}
          />
        </div>
      </Section>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleLogout}
        className="w-full py-3.5 bg-white text-red-500 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-red-100 hover:bg-red-50 transition-all"
      >
        <LogOut size={16} />
        Se déconnecter
      </motion.button>

      {/* Delete account */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        onClick={() => setShowDeleteConfirm(true)}
        className="w-full py-3 text-slate-400 text-xs font-medium hover:text-red-500 transition-colors flex items-center justify-center gap-1.5"
      >
        <Trash2 size={12} />
        Supprimer mon compte
      </motion.button>

      <p className="text-center text-slate-300 text-[10px] font-medium uppercase tracking-widest pb-2">
        Info Jeunes CCAPV · v1.0.0
      </p>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Supprimer ton compte"
        message="Cette action est irréversible. Toutes tes données (feedbacks, préférences) seront supprimées. Es-tu sûr ?"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  )
}

// ── Composants locaux ───────────────────────────────────────

function Section({
  title,
  icon: Icon,
  delay = 0,
  children,
}: {
  title: string
  icon: any
  delay?: number
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
    >
      <div className="flex items-center gap-2.5 px-5 pt-4 pb-2">
        <Icon size={16} className="text-indigo-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          {title}
        </h3>
      </div>
      <div className="px-5 pb-5">{children}</div>
    </motion.div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  muted = false,
}: {
  icon: any
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={cn('text-sm font-medium truncate', muted ? 'text-slate-300 italic' : 'text-slate-700')}>
          {value}
        </p>
      </div>
    </div>
  )
}

function EditRow({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
}: {
  icon: any
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

function MenuButton({
  icon: Icon,
  label,
  sublabel,
  iconBg,
  iconColor,
  onClick,
}: {
  icon: any
  label: string
  sublabel: string
  iconBg: string
  iconColor: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-xl transition-colors group hover:bg-slate-50"
    >
      <div className="flex items-center gap-3">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', iconBg, iconColor)}>
          <Icon size={16} />
        </div>
        <div className="text-left">
          <span className="text-sm font-medium text-slate-700 block">{label}</span>
          <span className="text-[10px] text-slate-400">{sublabel}</span>
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
    </button>
  )
}
