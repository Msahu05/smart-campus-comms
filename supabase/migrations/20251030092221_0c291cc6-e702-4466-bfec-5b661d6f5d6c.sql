-- Add professor reputation/credit score system
CREATE TABLE IF NOT EXISTS public.professor_reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credit_score INTEGER NOT NULL DEFAULT 100,
  total_queries_received INTEGER NOT NULL DEFAULT 0,
  queries_resolved INTEGER NOT NULL DEFAULT 0,
  avg_response_time_hours DECIMAL(10,2) DEFAULT NULL,
  total_appointments INTEGER NOT NULL DEFAULT 0,
  appointments_completed INTEGER NOT NULL DEFAULT 0,
  student_rating_avg DECIMAL(3,2) DEFAULT NULL,
  last_active_at TIMESTAMPTZ DEFAULT now(),
  reputation_badge TEXT DEFAULT 'silver',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(professor_id)
);

ALTER TABLE public.professor_reputation ENABLE ROW LEVEL SECURITY;

-- Policies for professor reputation
CREATE POLICY "Anyone can view professor reputation"
ON public.professor_reputation
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Professors can update their own reputation stats"
ON public.professor_reputation
FOR UPDATE
TO authenticated
USING (professor_id = auth.uid());

CREATE POLICY "System can insert reputation records"
ON public.professor_reputation
FOR INSERT
TO authenticated
WITH CHECK (professor_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_professor_reputation_updated_at
BEFORE UPDATE ON public.professor_reputation
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate reputation badge
CREATE OR REPLACE FUNCTION public.calculate_reputation_badge(score INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  IF score >= 90 THEN
    RETURN 'gold';
  ELSIF score >= 70 THEN
    RETURN 'silver';
  ELSIF score >= 50 THEN
    RETURN 'bronze';
  ELSE
    RETURN 'inactive';
  END IF;
END;
$$;

-- Add HOD registration keys table
CREATE TABLE IF NOT EXISTS public.professor_registration_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_key TEXT NOT NULL UNIQUE,
  college TEXT NOT NULL,
  department TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.professor_registration_keys ENABLE ROW LEVEL SECURITY;

-- Policies for registration keys
CREATE POLICY "HOD can view keys for their college"
ON public.professor_registration_keys
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'hod'::app_role)
  AND college = (
    SELECT p.college FROM public.profiles p WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "HOD can create keys for their college"
ON public.professor_registration_keys
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'hod'::app_role)
  AND college = (
    SELECT p.college FROM public.profiles p WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can verify unused keys"
ON public.professor_registration_keys
FOR SELECT
TO authenticated
USING (is_used = false AND expires_at > now());

CREATE POLICY "System can mark keys as used"
ON public.professor_registration_keys
FOR UPDATE
TO authenticated
USING (is_used = false);

-- Add file attachments table for queries
CREATE TABLE IF NOT EXISTS public.query_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID NOT NULL REFERENCES public.queries(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.query_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments for their queries"
ON public.query_attachments
FOR SELECT
TO authenticated
USING (
  query_id IN (
    SELECT id FROM public.queries WHERE student_id = auth.uid() OR professor_id = auth.uid()
  )
);

CREATE POLICY "Students can upload attachments to their queries"
ON public.query_attachments
FOR INSERT
TO authenticated
WITH CHECK (uploaded_by = auth.uid());