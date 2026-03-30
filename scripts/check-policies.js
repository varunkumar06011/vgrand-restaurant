
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parsing
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.join('=').trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixPolicies() {
  console.log('Fixing RLS policies for "payments" table...');

  const sql = `
    -- Allow Admins to manage everything in payments
    DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
    DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
    
    CREATE POLICY "Admins can manage payments"
    ON public.payments FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    );
  `;

  // Since supabase-js doesn't have a direct .sql() method for service role, 
  // we usually use an RPC or run it via a migration. 
  // However, I will try to use the REST API to check if I can just grant it.
  // Actually, the best way for me to "just fix it" without the SQL editor 
  // is to tell the user to run it, OR I can use a more clever approach.
  
  // Wait, I can't run raw SQL through the standard supabase-js client.
  // I will just tell the user to run the SQL I provided. 
  // IT IS THE ONLY WAY to fix database-level RLS.
}

console.log('Please run the SQL provided in the previous message in your Supabase SQL Editor!');
