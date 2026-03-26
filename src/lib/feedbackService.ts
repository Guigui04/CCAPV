import { supabase } from './supabase'
import { isValidUUID, isValidReaction, sanitizeText, LIMITS } from './validate'

export async function getFeedbacks({
  status,
  page = 1,
  limit = 20,
  communeId,
}: { status?: string; page?: number; limit?: number; communeId?: string | null } = {}) {
  let query = supabase
    .from('feedback')
    .select('*, news(title)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) query = query.eq('status', status)
  if (communeId) query = query.eq('commune_id', communeId)

  const { data, error, count } = await query
  if (error) throw error
  return { data: data ?? [], count: count ?? 0 }
}

export async function updateFeedbackStatus(id: string, status: string) {
  if (!isValidUUID(id)) throw new Error('ID invalide')
  const validStatuses = ['new', 'reviewed', 'archived']
  if (!validStatuses.includes(status)) throw new Error('Statut invalide')

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
  if (!isValidUUID(id)) throw new Error('ID invalide')
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
  commune_id?: string
  reaction: string
  comment?: string
}) {
  // Validate inputs
  if (!isValidUUID(news_id)) throw new Error('Article invalide')
  if (!isValidUUID(user_id)) throw new Error('Utilisateur invalide')
  if (commune_id && !isValidUUID(commune_id)) throw new Error('Commune invalide')
  if (!isValidReaction(reaction)) throw new Error('Réaction invalide')

  const row: Record<string, unknown> = { news_id, user_id, reaction }
  if (commune_id) row.commune_id = commune_id
  if (comment) row.comment = sanitizeText(comment, LIMITS.COMMENT)

  const { data, error } = await supabase
    .from('feedback')
    .insert([row])
    .select()
    .single()
  if (error) throw error
  return data
}
