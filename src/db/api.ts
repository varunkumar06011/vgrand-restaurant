import { supabase } from './supabase';
import type { MenuItem, Order, FunctionHallBooking, Review } from '@/types/restaurant';

// Menu Items - SUPABASE ONLY
export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('category')
      .order('is_bestseller', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

export async function getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
  try {
    if (!supabase) return [];

    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true);

    if (category !== 'all' && category !== 'All Items') {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('is_bestseller', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

export async function getBestsellerItems(): Promise<MenuItem[]> {
  try {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_bestseller', true)
      .eq('is_available', true)
      .limit(6);

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

// Orders
export async function createOrder(orderData: Partial<Order>): Promise<Order | null> {
  try {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error || !data) return null;
    return data;
  } catch (err) {
    console.error("Order error:", err);
    return null;
  }
}

export async function getOrderBySessionId(sessionId: string): Promise<Order | null> {
  try {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch (err) {
    console.error("Order query error:", err);
    return null;
  }
}

// Function Hall Bookings
export async function createBooking(bookingData: Partial<FunctionHallBooking>): Promise<FunctionHallBooking | null> {
  try {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('function_hall_bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error || !data) return null;
    return data;
  } catch (err) {
    console.error("Booking error:", err);
    return null;
  }
}

// Reviews
export async function getApprovedReviews(): Promise<Review[]> {
  try {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.error("Reviews error:", err);
    return [];
  }
}

export async function createReview(reviewData: Partial<Review>): Promise<Review | null> {
  try {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();

    if (error || !data) return null;
    return data;
  } catch (err) {
    console.error("Review creation error:", err);
    return null;
  }
}

// Stripe Payment
export async function createStripeCheckout(checkoutData: {
  items: any[];
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
}) {
  if (!supabase) throw new Error("Supabase not initialized");

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
  if (!supabase) throw new Error("Supabase not initialized");

  const { data, error } = await supabase.functions.invoke('verify_stripe_payment', {
    body: { sessionId },
  });

  if (error) {
    const errorMsg = await error?.context?.text?.();
    throw new Error(errorMsg || error?.message || 'Payment verification failed');
  }

  return data;
}
