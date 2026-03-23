import { supabase } from './supabase'

export async function getFeedbacks({ status, page = 1, limit = 20 }: { status?: string; page?: number; limit?: number } = {}) {
  let query = supabase.from('feedbacks').select('*, news(title)', { count: 'exact' }).order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1)
  if (status) query = query.eq('status', status)
  const { data, error, count } = await query
  if (error) throw error
  return { data, count }
}

export async function updateFeedbackStatus(id: string, status: string) {
  const { data, error } = await supabase.from('feedbacks').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteFeedback(id: string) {
  const { error } = await supabase.from('feedbacks').delete().eq('id', id)
  if (error) throw error
}

export async function submitFeedback({ news_id, author_email, content }: { news_id: string; author_email: string; content: string }) {
  const COMMUNE_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  const { data, error } = await supabase.from('feedbacks').insert([{ news_id, author_email, content, commune_id: COMMUNE_ID, status: 'pending' }]).select().single()
  if (error) throw error
  return data
}
