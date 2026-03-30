import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail-safe: Check if keys are missing in production/Vercel
export const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url' &&
  !supabaseUrl.includes('placeholder')
);

// Create the client with placeholders if missing (satisfies plugins and prevents top-level crash)
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder-vgrand.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder-key'
);