-- 00006_visitor_tracking.sql
-- Visitor Tracking System for V Grand Restaurant

-- 1. Create site_visits table
CREATE TABLE IF NOT EXISTS public.site_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow anyone to INSERT a visit log
CREATE POLICY "Public can log visits"
ON public.site_visits FOR INSERT
WITH CHECK (true);

-- Only Admins can SELECT visit data
CREATE POLICY "Admins can view visit statistics"
ON public.site_visits FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') OR
  auth.jwt()->>'role' = 'service_role'
);

-- 4. Create index for fast retrieval of stats
CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON public.site_visits(created_at);

-- 5. Enable Realtime for the dashboard
ALTER TABLE public.site_visits REPLICA IDENTITY FULL;
-- Enable for realtime publications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'site_visits'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visits;
  END IF;
END $$;
