import { supabase } from './supabase'

export async function getFeedbacks({
  status,
  page = 1,
  limit = 20,
}: { status?: string; page?: number; limit?: number } = {}) {
  let query = supabase
    .from('feedback')
    .select('*, news(title)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) query = query.eq('status', status)

  const { data, error, count } = await query
  if (error) throw error
  return { data: data ?? [], count: count ?? 0 }
}

export async function updateFeedbackStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('feedback')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteFeedback(id: string) {
  const { error } = await supabase.from('feedback').delete().eq('id', id)
  if (error) throw error
}

export async function submitFeedback({
  news_id,
  user_id,
  commune_id,
  reaction,
  comment,
}: {
  news_id: string
  user_id: string
  commune_id: string
  reaction: string
  comment?: string
}) {
  const { data, error } = await supabase
    .from('feedback')
    .insert([{ news_id, user_id, commune_id, reaction, comment }])
    .select()
    .single()
  if (error) throw error
  return data
}
