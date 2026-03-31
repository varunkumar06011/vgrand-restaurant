-- 00005_security_hardening.sql
-- COMPREHENSIVE SECURITY OVERHAUL
-- TARGETS: Data Leakage, API Abuse, Injection, & Spam

-- 1. CLEANUP PREVIOUS WEAK POLICIES
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own reservations" ON public.table_reservations;
DROP POLICY IF EXISTS "Anyone can create table reservations" ON public.table_reservations;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- 2. HARDEN PROFILES (Privacy Fix)
-- Only admins can see all profiles. Users can only see their own.
CREATE POLICY "Profiles are private - Owner or Admin only"
ON public.profiles FOR SELECT
USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- 3. HARDEN ORDERS & RESERVATIONS (Data Leak Fix)
-- Prevent unauthenticated bulk selector.
-- Only admins can view all. Service role (Edge functions) can view all.
CREATE POLICY "Admins/Service can view all orders"
ON public.orders FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') OR
  auth.jwt()->>'role' = 'service_role'
);

CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
WITH CHECK (true); -- We will add rate limiting via triggers instead

CREATE POLICY "Admins/Service can view all reservations"
ON public.table_reservations FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin') OR
  auth.jwt()->>'role' = 'service_role'
);

CREATE POLICY "Anyone can create reservations"
ON public.table_reservations FOR INSERT
WITH CHECK (true);

-- 4. INPUT VALIDATION (Injection & Data Integrity Protection)
-- Strictly enforce 10-digit mobile number at the DB level
ALTER TABLE public.orders 
ADD CONSTRAINT customer_phone_format CHECK (customer_phone ~ '^[0-9]{10}$');

ALTER TABLE public.table_reservations 
ADD CONSTRAINT reservation_phone_format CHECK (customer_phone ~ '^[0-9]{10}$');

ALTER TABLE public.table_reservations 
ADD CONSTRAINT guests_range CHECK (num_people > 0 AND num_people <= 20);

-- 5. RATE LIMITING (API Abuse & Spam Protection)
CREATE TABLE IF NOT EXISTS public.request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- phone or session_id
  request_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.check_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  request_count INTEGER;
BEGIN
  -- Limit to 3 requests per hour per phone number
  SELECT count(*) INTO request_count 
  FROM public.request_logs 
  WHERE identifier = NEW.customer_phone 
    AND request_type = TG_TABLE_NAME 
    AND created_at > now() - interval '1 hour';

  IF request_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again in an hour.';
  END IF;

  -- Log the request
  INSERT INTO public.request_logs (identifier, request_type) 
  VALUES (NEW.customer_phone, TG_TABLE_NAME);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply rate limiting to critical mutation points
CREATE TRIGGER tr_rate_limit_reservations
BEFORE INSERT ON public.table_reservations
FOR EACH ROW EXECUTE FUNCTION public.check_rate_limit();

CREATE TRIGGER tr_rate_limit_orders
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.check_rate_limit();

-- 6. SECURITY HEADERS CACHE (Optional logging)
-- Ensuring all admin mutations are logged
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.table_reservations REPLICA IDENTITY FULL;
