-- =====================================================
-- Fix: Allow super_admin to update any user's profile
-- Problem: super_admin couldn't assign a CC to users
-- because RLS policies only allowed self-updates
-- =====================================================

-- super_admin can update any profile (assign CC, change role, etc.)
CREATE POLICY "super_admin_update_any_profile" ON public.profiles
  FOR UPDATE USING (get_my_role() = 'super_admin')
  WITH CHECK (true);
