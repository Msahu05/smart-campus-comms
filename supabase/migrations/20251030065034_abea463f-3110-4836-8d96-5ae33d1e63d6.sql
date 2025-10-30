-- Add roll_number to profiles for student enrollment verification
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roll_number TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_roll_number_unique ON public.profiles (roll_number) WHERE roll_number IS NOT NULL;

-- Create system_settings table for per-college configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college TEXT NOT NULL UNIQUE,
  enable_ai_assistant BOOLEAN NOT NULL DEFAULT true,
  max_appointments_per_day INTEGER NOT NULL DEFAULT 8,
  allow_student_cancellation BOOLEAN NOT NULL DEFAULT true,
  enable_realtime_notifications BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Trigger to update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_system_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;

-- Policies: allow reads within same college; only HOD can write for their college
CREATE POLICY "Select settings for user's college"
ON public.system_settings
FOR SELECT
TO authenticated
USING (
  college = (
    SELECT p.college FROM public.profiles p WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "HOD can insert settings for their college"
ON public.system_settings
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'hod'::app_role)
  AND college = (
    SELECT p.college FROM public.profiles p WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "HOD can update settings for their college"
ON public.system_settings
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'hod'::app_role)
  AND college = (
    SELECT p.college FROM public.profiles p WHERE p.user_id = auth.uid()
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'hod'::app_role)
  AND college = (
    SELECT p.college FROM public.profiles p WHERE p.user_id = auth.uid()
  )
);
