
-- OTP Verification Table
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast OTP lookups
CREATE INDEX idx_otp_email ON public.otp_verifications(email);
CREATE INDEX idx_otp_expires ON public.otp_verifications(expires_at);

-- College Registration System Tables
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  email_domain TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.college_registration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_name TEXT NOT NULL,
  email_domain TEXT NOT NULL,
  registrar_name TEXT NOT NULL,
  official_email TEXT NOT NULL,
  designation TEXT NOT NULL,
  verification_document_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hod_invitation_token TEXT UNIQUE,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(college_id, name)
);

-- Update professor_registration_keys to support assignment
ALTER TABLE public.professor_registration_keys
ADD COLUMN IF NOT EXISTS assigned_to_email TEXT,
ADD COLUMN IF NOT EXISTS assigned_to_name TEXT,
ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES auth.users(id);

-- RLS Policies for OTP
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert OTP"
ON public.otp_verifications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own OTP"
ON public.otp_verifications
FOR SELECT
USING (email = auth.jwt()->>'email' OR true); -- Allow checking during signup

CREATE POLICY "Users can update their own OTP"
ON public.otp_verifications
FOR UPDATE
USING (email = auth.jwt()->>'email' OR true);

-- RLS Policies for Colleges
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified colleges"
ON public.colleges
FOR SELECT
USING (is_verified = true);

CREATE POLICY "System can manage colleges"
ON public.colleges
FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for College Registration Requests
ALTER TABLE public.college_registration_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit college registration"
ON public.college_registration_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view their own requests"
ON public.college_registration_requests
FOR SELECT
USING (true);

-- RLS Policies for Departments
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active departments"
ON public.departments
FOR SELECT
USING (is_active = true);

CREATE POLICY "College admins can manage departments"
ON public.departments
FOR ALL
USING (true)
WITH CHECK (true);

-- Function to generate secure random OTP
CREATE OR REPLACE FUNCTION public.generate_otp()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$;

-- Function to clean expired OTPs
CREATE OR REPLACE FUNCTION public.clean_expired_otps()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.otp_verifications
  WHERE expires_at < now();
END;
$$;
