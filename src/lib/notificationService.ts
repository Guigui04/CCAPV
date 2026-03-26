import { supabase } from './supabase'
import { isValidUUID, isValidAlertType, sanitizeText, LIMITS } from './validate'

export async function getNotifications(communeId?: string) {
  let query = supabase
    .from('notifications')
    .select('*')
    .order('sent_at', { ascending: false })
    .limit(50)

  if (communeId) {
    if (!isValidUUID(communeId)) throw new Error('Commune invalide')
    // User sees their commune notifs + global ones
    query = query.or(`commune_id.eq.${communeId},commune_id.is.null`)
  } else {
    // User without commune sees only global notifs
    query = query.is('commune_id', null)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getReadNotificationIds(userId: string) {
  if (!isValidUUID(userId)) throw new Error('Utilisateur invalide')
  const { data, error } = await supabase
    .from('user_notification_reads')
    .select('notification_id')
    .eq('user_id', userId)
  if (error) throw error
  return new Set((data ?? []).map((r) => r.notification_id))
}

export async function markNotificationRead(userId: string, notificationId: string) {
  if (!isValidUUID(userId) || !isValidUUID(notificationId)) throw new Error('Paramètres invalides')
  const { error } = await supabase
    .from('user_notification_reads')
    .upsert({ user_id: userId, notification_id: notificationId })
  if (error) throw error
}

export async function markAllNotificationsRead(userId: string, notificationIds: string[]) {
  if (!isValidUUID(userId)) throw new Error('Utilisateur invalide')
  const validIds = notificationIds.filter(isValidUUID)
  if (validIds.length === 0) return

  const rows = validIds.map((notification_id) => ({
    user_id: userId,
    notification_id,
  }))
  const { error } = await supabase
    .from('user_notification_reads')
    .upsert(rows)
  if (error) throw error
}

// ── Admin CRUD ──────────────────────────────────────────────

export async function getAllNotifications({
  page = 1,
  limit = 20,
  communeId,
}: { page?: number; limit?: number; communeId?: string | null } = {}) {
  const safeLimit = Math.min(Math.max(1, limit), 100)
  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .order('sent_at', { ascending: false })
    .range((page - 1) * safeLimit, page * safeLimit - 1)

  if (communeId) {
    query = query.or(`commune_id.eq.${communeId},commune_id.is.null`)
  }

  const { data, error, count } = await query
  if (error) throw error
  return { data: data ?? [], count: count ?? 0 }
}

export async function createNotification(payload: {
  title: string
  body: string
  type?: string
  commune_id?: string
  sent_by?: string
}) {
  // Validate
  const title = sanitizeText(payload.title, LIMITS.ALERT_TITLE)
  const body = sanitizeText(payload.body, LIMITS.ALERT_BODY)
  if (!title) throw new Error('Le titre est obligatoire')
  if (!body) throw new Error('Le contenu est obligatoire')
  if (payload.type && !isValidAlertType(payload.type)) throw new Error('Type invalide')
  if (payload.commune_id && !isValidUUID(payload.commune_id)) throw new Error('Commune invalide')

  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      title,
      body,
      type: payload.type ?? 'info',
      commune_id: payload.commune_id ?? null,
      sent_by: payload.sent_by ?? null,
      sent_at: new Date().toISOString(),
      status: 'sent',
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateNotification(id: string, payload: Record<string, unknown>) {
  if (!isValidUUID(id)) throw new Error('ID invalide')

  const safe: Record<string, unknown> = {}
  if (payload.title !== undefined) safe.title = sanitizeText(String(payload.title), LIMITS.ALERT_TITLE)
  if (payload.body !== undefined) safe.body = sanitizeText(String(payload.body), LIMITS.ALERT_BODY)
  if (payload.type !== undefined) {
    if (!isValidAlertType(String(payload.type))) throw new Error('Type invalide')
    safe.type = payload.type
  }

  const { data, error } = await supabase
    .from('notifications')
    .update(safe)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteNotification(id: string) {
  if (!isValidUUID(id)) throw new Error('ID invalide')
  const { error } = await supabase.from('notifications').delete().eq('id', id)
  if (error) throw error
}
