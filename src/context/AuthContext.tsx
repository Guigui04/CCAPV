import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { validatePassword } from '../lib/validate'

interface Profile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: 'user' | 'super_admin' | 'commune_admin'
  commune_id?: string
  birth_date?: string
  interests?: string[]
  created_at?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  communeId: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, extra?: { first_name?: string; last_name?: string }) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
  updateProfile: (fields: Partial<Pick<Profile, 'first_name' | 'last_name' | 'birth_date' | 'commune_id' | 'interests'>>) => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Fixed safe redirect URL (no open redirect possible)
const SITE_URL = window.location.origin

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
    } catch {
      // Profile might not exist yet
      setProfile(null)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('Email ou mot de passe incorrect')
  }

  async function register(
    email: string,
    password: string,
    extra?: { first_name?: string; last_name?: string }
  ) {
    // Enforce password complexity
    const pwdCheck = validatePassword(password)
    if (!pwdCheck.valid) {
      throw new Error(`Mot de passe trop faible : ${pwdCheck.errors.join(', ')}`)
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${SITE_URL}/login`,
        data: {
          first_name: extra?.first_name?.slice(0, 50) ?? '',
          last_name: extra?.last_name?.slice(0, 50) ?? '',
        },
      },
    })
    if (error) throw error
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${SITE_URL}/`,
      },
    })
    if (error) throw error
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/login`,
    })
    if (error) throw error
  }

  async function changePassword(newPassword: string) {
    // Enforce password complexity
    const pwdCheck = validatePassword(newPassword)
    if (!pwdCheck.valid) {
      throw new Error(`Mot de passe trop faible : ${pwdCheck.errors.join(', ')}`)
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  async function updateProfile(fields: Partial<Pick<Profile, 'first_name' | 'last_name' | 'birth_date' | 'commune_id' | 'interests'>>) {
    if (!user) throw new Error('Non connecté')
    // Sanitize string fields
    const sanitized: Record<string, unknown> = {}
    if (fields.first_name !== undefined) sanitized.first_name = fields.first_name?.slice(0, 50)
    if (fields.last_name !== undefined) sanitized.last_name = fields.last_name?.slice(0, 50)
    if (fields.birth_date !== undefined) sanitized.birth_date = fields.birth_date
    if (fields.commune_id !== undefined) sanitized.commune_id = fields.commune_id || null
    if (fields.interests !== undefined) sanitized.interests = fields.interests

    const { error } = await supabase
      .from('profiles')
      .update(sanitized)
      .eq('id', user.id)
    if (error) throw error
    await fetchProfile(user.id)
  }

  async function deleteAccount() {
    if (!user) throw new Error('Non connecté')
    // Clean up user data
    await supabase.from('bookmarks').delete().eq('user_id', user.id)
    await supabase.from('feedback').delete().eq('user_id', user.id)
    await supabase.from('user_notification_reads').delete().eq('user_id', user.id)
    // Anonymize profile (actual auth user deletion requires Edge Function)
    await supabase.from('profiles').update({
      is_active: false,
      first_name: null,
      last_name: null,
      birth_date: null,
      interests: [],
      email: `deleted_${user.id.slice(0, 8)}@removed.local`,
    }).eq('id', user.id)
    // Call Edge Function for full auth deletion if available
    try {
      await supabase.functions.invoke('delete-user', { body: { user_id: user.id } })
    } catch {
      // Edge function may not be deployed yet - still proceed with sign out
    }
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'commune_admin'
  const isSuperAdmin = profile?.role === 'super_admin'
  const communeId = profile?.commune_id ?? null

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isAdmin, isSuperAdmin, communeId, login, register, logout, loginWithGoogle, resetPassword, changePassword, updateProfile, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
