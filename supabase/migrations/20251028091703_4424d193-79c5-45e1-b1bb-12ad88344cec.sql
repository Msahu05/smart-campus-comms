-- Create table for professor availability/office hours
CREATE TABLE IF NOT EXISTS public.office_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID NOT NULL,
  day_of_week TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for student queries/questions
CREATE TABLE IF NOT EXISTS public.queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  professor_id UUID NOT NULL,
  subject TEXT NOT NULL,
  question TEXT NOT NULL,
  response TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  professor_id UUID NOT NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for AI chat history
CREATE TABLE IF NOT EXISTS public.ai_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS but with permissive policies for now
ALTER TABLE public.office_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chats ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (anyone can do anything for now)
CREATE POLICY "Allow all on office_hours" ON public.office_hours FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on queries" ON public.queries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ai_chats" ON public.ai_chats FOR ALL USING (true) WITH CHECK (true);

-- Update triggers for timestamps
CREATE TRIGGER update_office_hours_updated_at
  BEFORE UPDATE ON public.office_hours
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_queries_updated_at
  BEFORE UPDATE ON public.queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();