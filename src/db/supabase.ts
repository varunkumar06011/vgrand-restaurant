import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail-safe: Check if keys are missing in production/Vercel
export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url');

// Create the client ONLY if keys exist, otherwise provide a dummy to prevent top-level crash
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;