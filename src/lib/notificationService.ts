import { supabase } from './supabase'

export async function getNotifications(communeId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('commune_id', communeId)
    .order('sent_at', { ascending: false })
    .limit(50)
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
