import { supabase } from './supabase'
import { getTabById } from '../constants'
import { sanitizeText, isValidUUID, isValidSafeUrl, LIMITS } from './validate'

export type SortOption = 'recent' | 'oldest' | 'title_asc' | 'title_desc'

export async function getPublishedNews({
  category,
  tab,
  page = 1,
  limit = 12,
  search,
  sort = 'recent',
}: {
  category?: string
  tab?: string
  page?: number
  limit?: number
  search?: string
  sort?: SortOption
} = {}) {
  // Clamp limit to prevent abuse
  const safeLimit = Math.min(Math.max(1, limit), 50)

  let query = supabase
    .from('news')
    .select('*', { count: 'exact' })
    .eq('status', 'published')

  if (sort === 'recent') query = query.order('created_at', { ascending: false })
  else if (sort === 'oldest') query = query.order('created_at', { ascending: true })
  else if (sort === 'title_asc') query = query.order('title', { ascending: true })
  else if (sort === 'title_desc') query = query.order('title', { ascending: false })

  query = query.range((page - 1) * safeLimit, page * safeLimit - 1)

  if (category) {
    query = query.eq('category_id', category)
  } else if (tab) {
    const tabObj = getTabById(tab)
    if (tabObj) {
      const subIds = tabObj.subcategories.map((s) => s.id)
      query = query.in('category_id', subIds)
    }
  }
  if (search) {
    // Sanitize search input: limit length, escape wildcards
    const safeSearch = sanitizeText(search, LIMITS.SEARCH).replace(/[%_]/g, '')
    if (safeSearch) {
      query = query.or(`title.ilike.%${safeSearch}%,content.ilike.%${safeSearch}%`)
    }
  }

  const { data, error, count } = await query
  if (error) throw error
  return { data: data ?? [], count: count ?? 0 }
}

export async function getAllNews({
  page = 1,
  limit = 20,
}: { page?: number; limit?: number } = {}) {
  const safeLimit = Math.min(Math.max(1, limit), 100)

  const { data, error, count } = await supabase
    .from('news')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * safeLimit, page * safeLimit - 1)

  if (error) throw error
  return { data: data ?? [], count: count ?? 0 }
}

export async function getNewsById(id: string) {
  if (!isValidUUID(id)) throw new Error('ID invalide')
  const { data, error } = await supabase.from('news').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createNews(payload: Record<string, unknown>) {
  // Sanitize fields
  const safe: Record<string, unknown> = {
    title: sanitizeText(String(payload.title ?? ''), LIMITS.TITLE),
    summary: sanitizeText(String(payload.summary ?? ''), LIMITS.SUMMARY),
    content: sanitizeText(String(payload.content ?? ''), LIMITS.CONTENT),
    category_id: payload.category_id,
    status: payload.status === 'published' ? 'published' : 'draft',
  }
  if (payload.image_url && typeof payload.image_url === 'string') {
    safe.image_url = isValidSafeUrl(payload.image_url) ? payload.image_url : ''
  }

  const { data, error } = await supabase.from('news').insert([safe]).select().single()
  if (error) throw error
  return data
}

export async function updateNews(id: string, payload: Record<string, unknown>) {
  if (!isValidUUID(id)) throw new Error('ID invalide')

  const safe: Record<string, unknown> = {}
  if (payload.title !== undefined) safe.title = sanitizeText(String(payload.title), LIMITS.TITLE)
  if (payload.summary !== undefined) safe.summary = sanitizeText(String(payload.summary), LIMITS.SUMMARY)
  if (payload.content !== undefined) safe.content = sanitizeText(String(payload.content), LIMITS.CONTENT)
  if (payload.category_id !== undefined) safe.category_id = payload.category_id
  if (payload.status !== undefined) safe.status = payload.status === 'published' ? 'published' : 'draft'
  if (payload.image_url !== undefined) {
    const url = String(payload.image_url)
    safe.image_url = url && isValidSafeUrl(url) ? url : ''
  }

  const { data, error } = await supabase
    .from('news')
    .update(safe)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteNews(id: string) {
  if (!isValidUUID(id)) throw new Error('ID invalide')
  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) throw error
}

export async function togglePublished(id: string, currentStatus: string) {
  const newStatus = currentStatus === 'published' ? 'draft' : 'published'
  return updateNews(id, { status: newStatus })
}
