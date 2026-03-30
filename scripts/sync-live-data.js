
import { createClient } from '@supabase/supabase-js';

// ---- OLD LIVE PROJECT (Source) ----
const oldUrl = 'https://quoyqdeztzajstqjesmq.supabase.co';
const oldAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1b3lxZGV6dHphamN0cWplc21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NDc0MTcsImV4cCI6MjA5MDIyMzQxN30.uCYCP05IHbcwW6_2xmdzfT8QFtgziIbXxOXWLPU97ZA';

// ---- NEW LOCAL PROJECT (Destination) ----
const newUrl = 'https://quecpuwlmbtdbitbvrpr.supabase.co';
const newServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZWNwdXdsbWJ0ZGJpdGJ2cnByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg3MDEwOSwiZXhwIjoyMDkwNDQ2MTA5fQ.NgcbAM2TMYr7X9roIC5So-7uHimQ8gL8c5Hj0ubAz48';

const sourceClient = createClient(oldUrl, oldAnon);
const destClient = createClient(newUrl, newServiceKey);

async function syncAtoZ() {
  console.log('🚀 Synchronizing Menu Items A to Z...');

  // 1. Fetch from OLD
  const { data: sourceItems, error: fetchError } = await sourceClient
    .from('menu_items')
    .select('*');

  if (fetchError) {
    console.error('❌ Failed to fetch from Live site:', fetchError.message);
    return;
  }

  console.log(`📦 Found ${sourceItems.length} items on Live site.`);

  // 2. Prepare for NEW (remove sensitive fields or keep as is)
  const itemsToUpload = sourceItems.map(item => {
    const { id, created_at, updated_at, ...cleanItem } = item;
    return cleanItem;
  });

  // 3. Upload to NEW
  const { error: uploadError } = await destClient
    .from('menu_items')
    .upsert(itemsToUpload, { onConflict: 'name' });

  if (uploadError) {
    console.error('❌ Failed to sync to local Admin:', uploadError.message);
  } else {
    console.log('✅ SUCCESS! All live items, images, and descriptions are now in your local Admin panel.');
  }
}

syncAtoZ();
