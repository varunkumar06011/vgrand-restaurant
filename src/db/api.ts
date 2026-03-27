import { supabase } from './supabase';
import type { MenuItem, Order, FunctionHallBooking, Review } from '@/types/restaurant';

// Menu Items
export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('category')
    .order('is_bestseller', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category', category)
    .eq('is_available', true)
    .order('is_bestseller', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getBestsellerItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_bestseller', true)
    .eq('is_available', true)
    .limit(6);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Orders
export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderBySessionId(sessionId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Function Hall Bookings
export async function createBooking(bookingData: Partial<FunctionHallBooking>): Promise<FunctionHallBooking> {
  const { data, error } = await supabase
    .from('function_hall_bookings')
    .insert(bookingData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Reviews
export async function getApprovedReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createReview(reviewData: Partial<Review>): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Stripe Payment
export async function createStripeCheckout(checkoutData: {
  items: any[];
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
}) {
  const { data, error } = await supabase.functions.invoke('create_stripe_checkout', {
    body: checkoutData,
  });

  if (error) {
    const errorMsg = await error?.context?.text?.();
    throw new Error(errorMsg || error?.message || 'Payment processing failed');
  }

  return data;
}

export async function verifyStripePayment(sessionId: string) {
  const { data, error } = await supabase.functions.invoke('verify_stripe_payment', {
    body: { sessionId },
  });

  if (error) {
    const errorMsg = await error?.context?.text?.();
    throw new Error(errorMsg || error?.message || 'Payment verification failed');
  }

  return data;
}
