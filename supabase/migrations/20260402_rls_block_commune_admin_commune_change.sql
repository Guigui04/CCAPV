-- Prevent commune_admin from changing their own commune_id
-- Only super_admin can assign a CC to a commune_admin

DROP POLICY IF EXISTS "user_update_own_profile" ON public.profiles;

-- Regular users can update their own profile (including commune_id)
CREATE POLICY "user_update_own_profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid() AND get_my_role() = 'user')
  WITH CHECK (id = auth.uid() AND role = 'user');

-- commune_admin can update own profile BUT NOT commune_id
-- WITH CHECK ensures commune_id must remain equal to current value
CREATE POLICY "commune_admin_update_own_profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid() AND get_my_role() = 'commune_admin')
  WITH CHECK (id = auth.uid() AND role = 'commune_admin' AND commune_id = get_my_commune_id());
