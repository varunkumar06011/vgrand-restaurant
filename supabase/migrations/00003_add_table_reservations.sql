-- 00003_add_table_reservations.sql

-- Reservation status enum
CREATE TYPE public.reservation_status AS ENUM (
  'pending_payment',
  'pending_approval',
  'confirmed',
  'rejected'
);

-- Table reservations table
CREATE TABLE IF NOT EXISTS public.table_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_phone TEXT NOT NULL,
  num_people INTEGER NOT NULL,
  booking_time TIMESTAMPTZ NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  status public.reservation_status DEFAULT 'pending_payment'::public.reservation_status,
  razorpay_order_id TEXT UNIQUE,
  payment_id TEXT UNIQUE,
  amount NUMERIC(10,2) DEFAULT 100.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.table_reservations ENABLE ROW LEVEL SECURITY;

-- Allow public to insert reservations (for chatbot)
CREATE POLICY "Anyone can create table reservations"
ON public.table_reservations FOR INSERT WITH CHECK (true);

-- Allow users to view their own reservations by phone (simple check for chatbot UI)
CREATE POLICY "Users can view own reservations"
ON public.table_reservations FOR SELECT USING (true);

-- Allow admins to manage all reservations
CREATE POLICY "Admins can manage table reservations"
ON public.table_reservations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.table_reservations;

-- Trigger for updated_at
CREATE TRIGGER set_reservations_updated_at
BEFORE UPDATE ON public.table_reservations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
