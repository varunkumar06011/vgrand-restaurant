import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail-safe: Check if keys are missing in production/Vercel
// Configuration Check: Allow local bypass if real keys are missing
export const isConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url' &&
  !supabaseUrl.includes('placeholder')
);

// Create the client. In dev, we use placeholders if keys are missing to allow UI rendering.
const isValidUrl = (url: string | undefined): url is string => 
  Boolean(url && url.startsWith('http') && !url.includes('placeholder') && url !== 'your_supabase_url');

const effectiveUrl = isValidUrl(supabaseUrl) 
  ? supabaseUrl 
  : 'https://placeholder-vgrand.supabase.co';

const effectiveKey = (supabaseAnonKey && !supabaseAnonKey.includes('placeholder') && supabaseAnonKey !== 'your_supabase_anon_key') 
  ? supabaseAnonKey 
  : 'placeholder-key';

export const supabase = createClient(effectiveUrl, effectiveKey);