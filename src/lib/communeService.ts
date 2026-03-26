import { supabase } from './supabase'
import { isValidUUID, sanitizeText, LIMITS } from './validate'

export interface Commune {
  id: string
  name: string
  slug: string
  logo_url?: string | null
  primary_color?: string | null
  is_active: boolean
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  subscription_status?: string | null
  trial_ends_at?: string | null
  max_admins: number
  max_news: number
  created_at: string
  updated_at: string
}

export async function getCommunes({
  page = 1,
  limit = 20,
  search,
}: { page?: number; limit?: number; search?: string } = {}) {
  const safeLimit = Math.min(Math.max(1, limit), 100)

  let query = supabase
    .from('communes')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true })
    .range((page - 1) * safeLimit, page * safeLimit - 1)

  if (search?.trim()) {
    const safeSearch = sanitizeText(search, LIMITS.SEARCH).replace(/[%_]/g, '')
    if (safeSearch) {
      query = query.ilike('name', `%${safeSearch}%`)
    }
  }

  const { data, error, count } = await query
  if (error) throw error
  return { data: data ?? [], count: count ?? 0 }
}

export async function getAllCommunesSimple() {
  const { data, error } = await supabase
    .from('communes')
    .select('id, name')
    .eq('is_active', true)
    .order('name', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getCommuneById(id: string) {
  if (!isValidUUID(id)) throw new Error('ID invalide')
  const { data, error } = await supabase
    .from('communes')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createCommune(payload: {
  name: string
  slug: string
  logo_url?: string
  plan?: string
}) {
  const name = sanitizeText(payload.name, LIMITS.NAME)
  if (!name) throw new Error('Le nom est obligatoire')

  const slug = payload.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 50)
  if (!slug) throw new Error('Le slug est obligatoire')

  const { data, error } = await supabase
    .from('communes')
    .insert([{
      name,
      slug,
      logo_url: payload.logo_url || null,
      plan: payload.plan || 'basic',
      is_active: true,
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCommune(id: string, payload: Record<string, unknown>) {
  if (!isValidUUID(id)) throw new Error('ID invalide')

  const safe: Record<string, unknown> = {}
  if (payload.name !== undefined) safe.name = sanitizeText(String(payload.name), LIMITS.NAME)
  if (payload.slug !== undefined) {
    safe.slug = String(payload.slug).toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 50)
  }
  if (payload.logo_url !== undefined) safe.logo_url = payload.logo_url || null
  if (payload.is_active !== undefined) safe.is_active = !!payload.is_active
  if (payload.plan !== undefined) safe.plan = String(payload.plan).slice(0, 20)

  const { data, error } = await supabase
    .from('communes')
    .update(safe)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCommune(id: string) {
  if (!isValidUUID(id)) throw new Error('ID invalide')
  const { error } = await supabase.from('communes').delete().eq('id', id)
  if (error) throw error
}
