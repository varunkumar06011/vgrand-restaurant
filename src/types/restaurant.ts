export type MenuCategory =
  | 'biryani'
  | 'veg_starters'
  | 'non_veg_starters'
  | 'veg_main_course'
  | 'non_veg_main_course'
  | 'rice_noodles'
  | 'snacks'
  | 'desserts';

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string | null;
  image_url: string | null;
  is_veg: boolean;
  spice_level: number;
  is_bestseller: boolean;
  is_new: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  items: any[];
  total_amount: number;
  currency: string;
  payment_method: string;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FunctionHallBooking {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  event_date: string;
  event_type: string;
  guest_count: number;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  review_text: string;
  status: ReviewStatus;
  created_at: string;
}

export interface CheckoutData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  payment_method: 'cod' | 'online';
}
