import { supabase } from './supabase'

export const CATEGORIES = [
  { id: 'news',        label: 'Actualités',   icon: '📰' },
  { id: 'sante',       label: 'Santé',         icon: '🏥' },
  { id: 'activites',   label: 'Activités',     icon: '🎯' },
  { id: 'sport',       label: 'Sport',         icon: '⚽' },
  { id: 'culture',     label: 'Culture',       icon: '🎭' },
  { id: 'emploi',      label: 'Emploi',        icon: '💼' },
  { id: 'orientation', label: 'Orientation',   icon: '🧭' },
  { id: 'aides',       label: 'Aides',         icon: '🤝' },
  { id: 'mobilite',    label: 'Mobilité',      icon: '🚌' },
  { id: 'logement',    label: 'Logement',      icon: '🏠' },
  { id: 'prevention',  label: 'Prévention',    icon: '🛡️' },
  { id: 'citoyennete', label: 'Citoyenneté',   icon: '🗳️' },
  { id: 'evenements',  label: 'Événements',    icon: '📅' },
]

export async function getPublishedNews({ category, page = 1, limit = 12 }: { category?: string; page?: number; limit?: number } = {}) {
  let query = supabase.from('news').select('*', { count: 'exact' }).eq('published', true).order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1)
  if (category) query = query.eq('category', category)
  const { data, error, count } = await query
  if (error) throw error
  return { data, count }
}

export async function getAllNews({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) {
  const { data, error, count } = await supabase.from('news').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1)
  if (error) throw error
  return { data, count }
}

export async function getNewsById(id: string) {
  const { data, error } = await supabase.from('news').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createNews(payload: any) {
  const { data, error } = await supabase.from('news').insert([payload]).select().single()
  if (error) throw error
  return data
}

export async function updateNews(id: string, payload: any) {
  const { data, error } = await supabase.from('news').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteNews(id: string) {
  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) throw error
}

export async function togglePublished(id: string, published: boolean) {
  return updateNews(id, { published })
}
