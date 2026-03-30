
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
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupAdmin() {
  const email = 'admin@vgrand.com';
  const password = 'VGrandAdmin123!';

  console.log(`Setting up admin: ${email}...`);

  // 1. Sign Up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: 'V Grand Admin',
      }
    }
  });

  if (signUpError) {
    if (signUpError.message.includes('User already registered')) {
      console.log('User already exists, attempting to sign in...');
    } else {
      console.error('Sign up error:', signUpError.message);
      // Even if it fails, we try to sign in in case it was already created but not confirmed
    }
  }

  // 2. Sign In
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error('Sign in error:', signInError.message);
    return;
  }

  const userId = signInData.user.id;
  console.log('User authenticated. ID:', userId);

  // 3. Update Profile
  const { error: updateError } = await supabase
    .from('profiles')
    .upsert({ 
      id: userId, 
      email: email,
      name: 'V Grand Admin',
      role: 'admin',
      updated_at: new Date().toISOString()
    });

  if (updateError) {
    console.error('Update profile error:', updateError.message);
  } else {
    console.log('SUCCESS! Admin account ready.');
    console.log('---------------------------');
    console.log('URL: http://127.0.0.1:5173/admin/login');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('---------------------------');
  }
}

setupAdmin();
