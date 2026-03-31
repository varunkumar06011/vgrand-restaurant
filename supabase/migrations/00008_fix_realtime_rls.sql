-- Migration: 00008_fix_realtime_rls.sql
-- Fixes the Realtime Sync by allowing public SELECT on table_reservations.
-- Supabase Realtime requires SELECT permissions to broadcast updates to a client.

CREATE POLICY "Allow public select for realtime updates"
ON public.table_reservations FOR SELECT
USING (true);

-- Ensure table is prepared for full updates
ALTER TABLE public.table_reservations REPLICA IDENTITY FULL;
