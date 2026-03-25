import { supabase } from './supabase'

export async function getNotifications(communeId?: string) {
  let query = supabase
    .from('notifications')
    .select('*')
    .order('sent_at', { ascending: false })
    .limit(50)

  if (communeId) {
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
  const { data, error } = await supabase
    .from('user_notification_reads')
    .select('notification_id')
    .eq('user_id', userId)
  if (error) throw error
  return new Set((data ?? []).map((r) => r.notification_id))
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const { error } = await supabase
    .from('user_notification_reads')
    .upsert({ user_id: userId, notification_id: notificationId })
  if (error) throw error
}

export async function markAllNotificationsRead(userId: string, notificationIds: string[]) {
  const rows = notificationIds.map((notification_id) => ({
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
}: { page?: number; limit?: number } = {}) {
  const { data, error, count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .order('sent_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)
  if (error) throw error
  return { data: data ?? [], count: count ?? 0 }
}

export async function createNotification(payload: {
  title: string
  body: string
  news_id?: string
  commune_id?: string
  sent_by?: string
}) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ ...payload, sent_at: new Date().toISOString(), status: 'sent' }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateNotification(id: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('notifications')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteNotification(id: string) {
  const { error } = await supabase.from('notifications').delete().eq('id', id)
  if (error) throw error
}
