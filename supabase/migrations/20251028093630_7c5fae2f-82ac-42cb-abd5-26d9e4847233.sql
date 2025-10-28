-- Temporary open access policies to unblock development
-- WARNING: These policies are permissive and should be tightened later.

-- Profiles: allow anyone to read profiles (temporary)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Allow all select on profiles (temporary)'
  ) THEN
    CREATE POLICY "Allow all select on profiles (temporary)"
    ON public.profiles
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- user_roles: allow anyone to read roles (temporary)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Allow all select on user_roles (temporary)'
  ) THEN
    CREATE POLICY "Allow all select on user_roles (temporary)"
    ON public.user_roles
    FOR SELECT
    USING (true);
  END IF;
END $$;