import { supabase } from './supabase'
import { isValidUUID } from './validate'

// Session ID for deduplication (one view per article per session)
let sessionId: string | null = null
function getSessionId() {
  if (!sessionId) {
    sessionId = sessionStorage.getItem('analytics_session')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem('analytics_session', sessionId)
    }
  }
  return sessionId
}

export async function trackView(newsId: string, communeId?: string | null, userId?: string | null) {
  if (!isValidUUID(newsId)) return
  try {
    await supabase.from('article_views').insert([{
      news_id: newsId,
      commune_id: communeId || null,
      user_id: userId || null,
      session_id: getSessionId(),
    }])
  } catch {
    // Fire-and-forget — don't break UX on tracking failure
  }
}

export interface AnalyticsData {
  totalViews: number
  totalUsers: number
  totalArticles: number
  topArticles: { id: string; title: string; views: number }[]
  viewsByDay: { date: string; count: number }[]
}

export async function getAnalytics({
  communeId,
  days = 30,
}: { communeId?: string | null; days?: number } = {}): Promise<AnalyticsData> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceStr = since.toISOString()

  // Total views
  let viewsQ = supabase
    .from('article_views')
    .select('*', { count: 'exact', head: true })
    .gte('viewed_at', sinceStr)
  if (communeId) viewsQ = viewsQ.eq('commune_id', communeId)
  const { count: totalViews } = await viewsQ

  // Total users (profiles count)
  let usersQ = supabase.from('profiles').select('*', { count: 'exact', head: true })
  if (communeId) usersQ = usersQ.eq('commune_id', communeId)
  const { count: totalUsers } = await usersQ

  // Total published articles
  let articlesQ = supabase.from('news').select('*', { count: 'exact', head: true }).eq('status', 'published')
  if (communeId) articlesQ = articlesQ.eq('commune_id', communeId)
  const { count: totalArticles } = await articlesQ

  // Top articles by views
  let topQ = supabase
    .from('article_views')
    .select('news_id, news(title)')
    .gte('viewed_at', sinceStr)
  if (communeId) topQ = topQ.eq('commune_id', communeId)
  const { data: viewRows } = await topQ.limit(500)

  const countMap = new Map<string, { title: string; count: number }>()
  for (const row of viewRows ?? []) {
    const key = row.news_id
    const existing = countMap.get(key)
    const title = (row as any).news?.title ?? 'Article supprimé'
    if (existing) {
      existing.count++
    } else {
      countMap.set(key, { title, count: 1 })
    }
  }
  const topArticles = [...countMap.entries()]
    .map(([id, { title, count }]) => ({ id, title, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  // Views by day
  const dayMap = new Map<string, number>()
  for (const row of viewRows ?? []) {
    const day = (row as any).viewed_at?.slice(0, 10) ?? ''
    if (day) dayMap.set(day, (dayMap.get(day) ?? 0) + 1)
  }
  const viewsByDay = [...dayMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalViews: totalViews ?? 0,
    totalUsers: totalUsers ?? 0,
    totalArticles: totalArticles ?? 0,
    topArticles,
    viewsByDay,
  }
}
