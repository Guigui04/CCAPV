import { supabase } from './supabase'
import { getTabById } from '../constants'

export async function getPublishedNews({
  category,
  tab,
  page = 1,
  limit = 12,
  search,
}: {
  category?: string
  tab?: string
  page?: number
  limit?: number
  search?: string
} = {}) {
  let query = supabase
    .from('news')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (category) {
    query = query.eq('category_id', category)
  } else if (tab) {
    const tabObj = getTabById(tab)
    if (tabObj) {
      const subIds = tabObj.subcategories.map((s) => s.id)
      query = query.in('category_id', subIds)
    }
  }
  if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)

  const { data, error, count } = await query
  if (error) throw error
  return { data: data ?? [], count: count ?? 0 }
}

export async function getAllNews({
  page = 1,
  limit = 20,
}: { page?: number; limit?: number } = {}) {
  const { data, error, count } = await supabase
    .from('news')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) throw error
  return { data: data ?? [], count: count ?? 0 }
}

export async function getNewsById(id: string) {
  const { data, error } = await supabase.from('news').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createNews(payload: Record<string, unknown>) {
  const { data, error } = await supabase.from('news').insert([payload]).select().single()
  if (error) throw error
  return data
}

export async function updateNews(id: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('news')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteNews(id: string) {
  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) throw error
}

export async function togglePublished(id: string, currentStatus: string) {
  const newStatus = currentStatus === 'published' ? 'draft' : 'published'
  return updateNews(id, { status: newStatus })
}
