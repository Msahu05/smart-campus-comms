-- Fix user_roles policies to allow self-assign during signup and grant HOD full management
-- Ensure RLS is enabled (it already is, but harmless if repeated)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to create their own role records for signup (student/professor/hod)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can create their own role (limited)'
  ) THEN
    CREATE POLICY "Users can create their own role (limited)"
    ON public.user_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (
      auth.uid() = user_id
      AND role IN ('student','professor','hod')
    );
  END IF;
END $$;

-- HOD/Admins can view all roles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'HOD can view all roles'
  ) THEN
    CREATE POLICY "HOD can view all roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'hod'));
  END IF;
END $$;

-- HOD/Admins can insert, update, delete any role
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'HOD can insert roles'
  ) THEN
    CREATE POLICY "HOD can insert roles"
    ON public.user_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'hod'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'HOD can update roles'
  ) THEN
    CREATE POLICY "HOD can update roles"
    ON public.user_roles
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'hod'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'HOD can delete roles'
  ) THEN
    CREATE POLICY "HOD can delete roles"
    ON public.user_roles
    FOR DELETE
    TO authenticated
    USING (public.has_role(auth.uid(), 'hod'));
  END IF;
END $$;
