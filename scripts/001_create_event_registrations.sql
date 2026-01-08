-- Create event_registrations table for tracking user registrations to events
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  institution TEXT,
  specialty TEXT,
  experience_level TEXT,
  dietary_requirements TEXT,
  special_needs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can register for events"
  ON public.event_registrations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all registrations"
  ON public.event_registrations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can update registrations"
  ON public.event_registrations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete registrations"
  ON public.event_registrations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

-- Create index for faster queries
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_email ON public.event_registrations(email);
