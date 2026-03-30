
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

// IMPORTANT: Using service_role key to bypass RLS and update profiles directly
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixAdmin() {
  const targetEmail = 'kirankumarchowdary637@gmail.com';
  
  console.log(`Fixing admin permissions for: ${targetEmail}...`);

  // 1. Find the user ID in Auth
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  const user = users.find(u => u.email === targetEmail);
  
  if (!user) {
    console.warn(`User ${targetEmail} not found in Auth. Please sign up first!`);
    // Alternatively, I can create it for them if they want, but let's see if it's there.
    return;
  }

  const userId = user.id;
  console.log('Found User ID:', userId);

  // 2. Set role = 'admin' in profiles table
  const { error: updateError } = await supabase
    .from('profiles')
    .upsert({ 
      id: userId, 
      email: targetEmail,
      role: 'admin',
      updated_at: new Date().toISOString()
    });

  if (updateError) {
    console.error('Update profile error:', updateError.message);
  } else {
    console.log('SUCCESS! Admin role granted in project quecpuwlmbtdbitbvrpr.');
    console.log('---------------------------');
    console.log('User:', targetEmail);
    console.log('Role: admin');
    console.log('---------------------------');
  }
}

fixAdmin();
