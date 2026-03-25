import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: 'user' | 'super_admin' | 'commune_admin'
  commune_id?: string
  birth_date?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, extra?: { first_name?: string; last_name?: string }) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
  updateProfile: (fields: Partial<Pick<Profile, 'first_name' | 'last_name' | 'birth_date' | 'commune_id'>>) => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

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
    if (error) throw error
  }

  async function register(
    email: string,
    password: string,
    extra?: { first_name?: string; last_name?: string }
  ) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: extra?.first_name ?? '',
          last_name: extra?.last_name ?? '',
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
        redirectTo: window.location.href,
      },
    })
    if (error) throw error
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    if (error) throw error
  }

  async function changePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  async function updateProfile(fields: Partial<Pick<Profile, 'first_name' | 'last_name' | 'birth_date' | 'commune_id'>>) {
    if (!user) throw new Error('Non connecté')
    const { error } = await supabase
      .from('profiles')
      .update(fields)
      .eq('id', user.id)
    if (error) throw error
    await fetchProfile(user.id)
  }

  async function deleteAccount() {
    if (!user) throw new Error('Non connecté')
    // Delete profile data, then sign out (full deletion requires admin/edge function)
    await supabase.from('feedback').delete().eq('user_id', user.id)
    await supabase.from('user_notification_reads').delete().eq('user_id', user.id)
    await supabase.from('profiles').update({ is_active: false, first_name: null, last_name: null, birth_date: null }).eq('id', user.id)
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'commune_admin'

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isAdmin, login, register, logout, loginWithGoogle, resetPassword, changePassword, updateProfile, deleteAccount }}
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
