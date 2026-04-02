-- =====================================================
-- Phase 5: RLS Multi-Tenant Isolation
-- Fixes gaps in existing policies for CC-based isolation
-- =====================================================

-- 1. NEWS: users should only see published news from their CC or global
DROP POLICY IF EXISTS "users_read_published_news" ON public.news;
CREATE POLICY "users_read_published_news" ON public.news
  FOR SELECT USING (
    status = 'published'
    AND (
      commune_id IS NULL
      OR commune_id = get_my_commune_id()
    )
  );

-- 2. COMMUNES: authenticated users need to see all active communes
--    (for registration flow and CommuneSelectionPage)
DROP POLICY IF EXISTS "authenticated_see_active_communes" ON public.communes;
CREATE POLICY "authenticated_see_active_communes" ON public.communes
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND is_active = true
  );

-- 3. ARTICLE_VIEWS: commune_admin should only see views for their CC's articles
DROP POLICY IF EXISTS "admin_read_views" ON public.article_views;
CREATE POLICY "admin_read_views" ON public.article_views
  FOR SELECT USING (
    get_my_role() = 'super_admin'
    OR (
      get_my_role() = 'commune_admin'
      AND news_id IN (
        SELECT id FROM public.news WHERE commune_id = get_my_commune_id()
      )
    )
  );

-- 4. BOOKMARKS: commune_admin should only see bookmarks of users in their CC
DROP POLICY IF EXISTS "Admins can view all bookmarks" ON public.bookmarks;
CREATE POLICY "admin_view_bookmarks" ON public.bookmarks
  FOR SELECT USING (
    get_my_role() = 'super_admin'
    OR (
      get_my_role() = 'commune_admin'
      AND user_id IN (
        SELECT id FROM public.profiles WHERE commune_id = get_my_commune_id()
      )
    )
  );

-- 5. PUSH_SUBSCRIPTIONS: fix commune_admin scope
DROP POLICY IF EXISTS "commune_admin_see_subscriptions" ON public.push_subscriptions;
CREATE POLICY "commune_admin_see_subscriptions" ON public.push_subscriptions
  FOR SELECT USING (
    get_my_role() = 'super_admin'
    OR (
      get_my_role() = 'commune_admin'
      AND commune_id = get_my_commune_id()
    )
  );
