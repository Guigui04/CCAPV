import { supabase } from './supabase'
import { isValidUUID } from './validate'

export async function getBookmarks(userId: string) {
  if (!isValidUUID(userId)) throw new Error('Utilisateur invalide')
  const { data, error } = await supabase
    .from('bookmarks')
    .select('news_id')
    .eq('user_id', userId)
  if (error) throw error
  return new Set((data ?? []).map((b) => b.news_id))
}

export async function getBookmarkedArticles(userId: string) {
  if (!isValidUUID(userId)) throw new Error('Utilisateur invalide')
  const { data, error } = await supabase
    .from('bookmarks')
    .select('news_id, created_at, news:news_id(id, title, summary, category_id, image_url, created_at)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((b: any) => b.news).filter(Boolean)
}

export async function addBookmark(userId: string, newsId: string) {
  if (!isValidUUID(userId) || !isValidUUID(newsId)) throw new Error('Paramètres invalides')
  const { error } = await supabase
    .from('bookmarks')
    .upsert({ user_id: userId, news_id: newsId })
  if (error) throw error
}

export async function removeBookmark(userId: string, newsId: string) {
  if (!isValidUUID(userId) || !isValidUUID(newsId)) throw new Error('Paramètres invalides')
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('news_id', newsId)
  if (error) throw error
}
