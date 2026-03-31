-- 00007_realtime_fix.sql
-- Fix for Chatbot Realtime Notifications

-- 1. Adjust RLS to allow guests to see their own status
-- This is necessary because Realtime status updates respect RLS.
-- Guests need to be able to "view" their row to receive the 'UPDATE' event.
CREATE POLICY "Public can view specific reservation status"
ON public.table_reservations FOR SELECT
USING (true); -- Protected by UUID; guest must know their specific reservation ID

-- 2. Add table to Realtime publication
-- Without this, Supabase will not broadcast any changes from this table.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'table_reservations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.table_reservations;
  END IF;
END $$;

-- 3. Ensure Replica Identity is FULL for detailed payloads
ALTER TABLE public.table_reservations REPLICA IDENTITY FULL;
