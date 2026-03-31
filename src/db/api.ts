import { supabase } from './supabase';
import { isConfigured } from './supabase';
import type { MenuItem, Order, FunctionHallBooking, Review } from '@/types/restaurant';

const MOCK_MENU_ITEMS: MenuItem[] = [
  // Biryani
  {
    id: 'mock-1',
    name: 'Special Chicken Biryani',
    description: 'Royal long-grain basmati rice cooked with spice-marinated chicken in traditional dum style.',
    price: 350,
    category: 'biryani',
    image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: true,
    is_veg: false,
    spice_level: 3,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-2',
    name: 'Veg Dum Biryani',
    description: 'Fresh seasonal vegetables slow-cooked with aromatic basmati rice and secret spices.',
    price: 280,
    category: 'biryani',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    spice_level: 2,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-3',
    name: 'Mutton Keema Biryani',
    description: 'Exquisite mutton keema layered with fragrant rice and royal spices.',
    price: 420,
    category: 'biryani',
    image_url: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a54?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: true,
    is_veg: false,
    spice_level: 3,
    is_new: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Veg Starters
  {
    id: 'mock-4',
    name: 'Veg Manchurian',
    description: 'Crispy vegetable balls tossed in a tangy, spicy Indo-Chinese sauce.',
    price: 180,
    category: 'veg_starters',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    spice_level: 2,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-5',
    name: 'Paneer 65',
    description: 'Deep-fried paneer cubes tempered with curry leaves and spicy yogurt sauce.',
    price: 240,
    category: 'veg_starters',
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: true,
    is_veg: true,
    spice_level: 3,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Non-Veg Starters
  {
    id: 'mock-6',
    name: 'Chicken 65',
    description: 'The legendary spicy, deep-fried chicken tempered with curry leaves and green chilies.',
    price: 220,
    category: 'non_veg_starters',
    image_url: 'https://images.unsplash.com/photo-1626132646529-5aa2d2d8298b?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: true,
    is_veg: false,
    spice_level: 3,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-7',
    name: 'Apollo Fish',
    description: 'Hyderabadi style spicy boneless fish chunks fried and tossed in specialized spices.',
    price: 320,
    category: 'non_veg_starters',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: true,
    is_veg: false,
    spice_level: 3,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-8',
    name: 'Prawn Fry',
    description: 'Butterflied prawns deep-fried with a crispy coastal spice coating.',
    price: 320,
    category: 'non_veg_starters',
    image_url: 'https://images.unsplash.com/photo-1623961990059-28355e22c88f?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: false,
    is_veg: false,
    spice_level: 2,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Main Course
  {
    id: 'mock-9',
    name: 'Paneer Butter Masala',
    description: 'Soft paneer cubes in a classic, rich and creamy tomato-butter gravy.',
    price: 290,
    category: 'veg_main_course',
    image_url: 'https://images.unsplash.com/photo-1567188040759-fbbaad7ca3b5?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: true,
    is_veg: true,
    spice_level: 1,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-10',
    name: 'Butter Chicken',
    description: 'Tender chicken pieces simmered in a velvet tomato gravy with extra butter.',
    price: 340,
    category: 'non_veg_main_course',
    image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: true,
    is_veg: false,
    spice_level: 2,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Rice & Noodles
  {
    id: 'mock-11',
    name: 'Veg Fried Rice',
    description: 'Traditional wok-fried rice with seasonal vegetables and oriental seasonings.',
    price: 220,
    category: 'rice_noodles',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    spice_level: 1,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-12',
    name: 'Chicken Soft Noodles',
    description: 'Savory stir-fried noodles with julienned vegetables and tender chicken strips.',
    price: 260,
    category: 'rice_noodles',
    image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: false,
    is_veg: false,
    spice_level: 1,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Desserts
  {
    id: 'mock-13',
    name: 'Gulab Jamun (2pcs)',
    description: 'Warm, syrup-soaked milk solid dumplings, a classic royal dessert.',
    price: 90,
    category: 'desserts',
    image_url: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: true,
    is_veg: true,
    spice_level: 0,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock-14',
    name: 'Double Ka Meetha',
    description: 'Rich bread pudding dessert with saffron, nuts, and heavy cream.',
    price: 120,
    category: 'desserts',
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop',
    is_available: true,
    is_bestseller: false,
    is_veg: true,
    spice_level: 0,
    is_new: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Menu Items
export async function getMenuItems(): Promise<MenuItem[]> {
  if (!isConfigured) return MOCK_MENU_ITEMS;
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
  if (!isConfigured) {
    if (category === 'ALL' || category === 'All Items') return MOCK_MENU_ITEMS;
    return MOCK_MENU_ITEMS.filter(i => {
      // Normalize category comparison for flexibility
      const mockCat = i.category.toLowerCase();
      const searchCat = category.toLowerCase();
      return mockCat.includes(searchCat) || searchCat.includes(mockCat);
    });
  }
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
  if (!isConfigured) return MOCK_MENU_ITEMS.filter(i => i.is_bestseller);
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
