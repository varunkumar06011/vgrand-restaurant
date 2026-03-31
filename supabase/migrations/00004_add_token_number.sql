-- 00004_add_token_number.sql

-- Add token_number column as a serial so it auto-increments
ALTER TABLE public.table_reservations 
ADD COLUMN IF NOT EXISTS token_number SERIAL;

-- If you want it to start from a specific number (e.g. 2500)
-- SELECT setval('table_reservations_token_number_seq', 2500);
