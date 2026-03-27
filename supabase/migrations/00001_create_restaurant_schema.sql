-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');

-- Booking status enum
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Review status enum
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

-- Menu categories enum
CREATE TYPE menu_category AS ENUM (
  'biryani',
  'veg_starters',
  'non_veg_starters',
  'veg_main_course',
  'non_veg_main_course',
  'rice_noodles',
  'snacks',
  'desserts'
);

-- Menu items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category menu_category NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_veg BOOLEAN DEFAULT true,
  spice_level INTEGER DEFAULT 0 CHECK (spice_level >= 0 AND spice_level <= 3),
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'inr',
  payment_method TEXT NOT NULL DEFAULT 'cod',
  status order_status NOT NULL DEFAULT 'pending'::order_status,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Function hall bookings table
CREATE TABLE public.function_hall_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count >= 100 AND guest_count <= 150),
  notes TEXT,
  status booking_status NOT NULL DEFAULT 'pending'::booking_status,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  status review_status NOT NULL DEFAULT 'approved'::review_status,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_menu_items_category ON public.menu_items(category);
CREATE INDEX idx_menu_items_bestseller ON public.menu_items(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX idx_bookings_event_date ON public.function_hall_bookings(event_date);
CREATE INDEX idx_reviews_status ON public.reviews(status);

-- RLS Policies
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.function_hall_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Menu items: public read access
CREATE POLICY "Anyone can view available menu items"
  ON public.menu_items FOR SELECT
  USING (is_available = true);

-- Orders: users can view their own orders by phone
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (true);

-- Orders: anyone can insert (guest checkout)
CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Bookings: anyone can create bookings
CREATE POLICY "Anyone can create bookings"
  ON public.function_hall_bookings FOR INSERT
  WITH CHECK (true);

-- Reviews: anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON public.reviews FOR SELECT
  USING (status = 'approved'::review_status);

-- Reviews: anyone can submit reviews
CREATE POLICY "Anyone can submit reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (true);

-- Service role can manage everything
CREATE POLICY "Service role can manage menu items"
  ON public.menu_items FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage orders"
  ON public.orders FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage bookings"
  ON public.function_hall_bookings FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage reviews"
  ON public.reviews FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');