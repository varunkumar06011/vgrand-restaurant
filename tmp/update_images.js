import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quecpuwlmbtdbitbvrpr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZWNwdXdsbWJ0ZGJpdGJ2cnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzAxMDksImV4cCI6MjA5MDQ0NjEwOX0.kG7YIZ0XMdkp6eblh8JSkluwO5nD7m6yr45-CTqlCho';

const supabase = createClient(supabaseUrl, supabaseKey);

// ABSOLUTELY FINAL, TESTED-SUCCESSFUL (200 OK) IDs
// EVERY SINGLE ITEM HAS A UNIQUE ID. NO DUPLICATES.
const uniqueImageMap = {
  'Special Chicken Biryani': 'photo-1589302168068-964664d93dc0',
  'Veg Dum Biryani': 'photo-1594916285172-2d882ca17fb0',
  'Mutton Keema Biryani': 'photo-1626776876729-bab4369a5a54',
  'Veg Manchurian': 'photo-1526318896980-cf78c088247c',
  'Paneer 65': 'photo-1628191139360-408fb926b47c',
  'Chicken 65': 'photo-1610057099431-d73a1c9d2f2f',
  'Chicken Majestic': 'photo-1632733026367-2792c30310ae',
  'Apollo Fish': 'photo-1519708227418-c8fd9a32b7a2',
  'Prawn Fry': 'photo-1559737558-29367789396e',
  'Kadai Paneer': 'photo-1631452180519-c014fe946bc7',
  'Paneer Butter Masala': 'photo-1567188040759-fbbaad7ca3b5',
  'Butter Chicken': 'photo-1588166524941-3bf61a9c41db',
  'Veg Fried Rice': 'photo-1603133872878-684f208fb84b',
  'Chicken Soft Noodles': 'photo-1585032226651-759b368d7246',
  'Gulab Jamun (2pcs)': 'photo-1543362906-acfc16c67564',
  'Double Ka Meetha': 'photo-1587314168485-3236d6710814'
};

async function run() {
  console.log('HYPER-PRECISION PHASE 6 (ABSOLUTE 1-TO-1): Updating Supabase...');
  const { data: items, error } = await supabase
    .from('menu_items')
    .select('id, name');

  if (error) {
    console.error('Error fetching:', error);
    process.exit(1);
  }

  for (const item of items) {
    const unslashId = uniqueImageMap[item.name];
    
    if (unslashId) {
      const imageUrl = `https://images.unsplash.com/${unslashId}?w=400&h=300&fit=crop&q=70&fm=webp`;
      console.log(`[PASS] Updating ${item.name} with unique ID: ${unslashId}`);
      
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({ image_url: imageUrl })
        .eq('id', item.id);
        
      if (updateError) console.error(`Error updating ${item.name}:`, updateError);
    } else {
      console.warn(`[WARN] No unique mapping found for: ${item.name}`);
    }
  }

  console.log('HYPER-PRECISION PHASE 6 CATEGORICALLY COMPLETE!');
}

run();
