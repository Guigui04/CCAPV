-- =====================================================
-- Fix: Allow anonymous users to read active communes
-- Problem: Registration page couldn't load intercommunalités
-- because the RLS policy required auth.uid() IS NOT NULL
-- =====================================================

-- Drop the old policy that blocked anonymous reads
DROP POLICY IF EXISTS "authenticated_see_active_communes" ON public.communes;

-- New policy: anyone (anon + authenticated) can see active communes
-- This is safe because we only expose active communes and the
-- select query in getAllCommunesSimple only fetches id + name
CREATE POLICY "anyone_see_active_communes" ON public.communes
  FOR SELECT USING (is_active = true);
