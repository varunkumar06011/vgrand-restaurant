import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quecpuwlmbtdbitbvrpr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZWNwdXdsbWJ0ZGJpdGJ2cnByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDg3MDEwOSwiZXhwIjoyMDkwNDQ2MTA5fQ.NgcbAM2TMYr7X9roIC5So-7uHimQ8gL8c5Hj0ubAz48';

const supabase = createClient(supabaseUrl, supabaseKey);

const approvedMapping = {
  'Chicken 65': 'https://images.pexels.com/photos/36845619/pexels-photo-36845619.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'Double Ka Meetha': 'https://images.pexels.com/photos/36844861/pexels-photo-36844861.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'V Grand Special Platter': 'https://images.pexels.com/photos/36845077/pexels-photo-36845077.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'Kadai Paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000',
  'Veg Manchurian': 'https://images.pexels.com/photos/36845203/pexels-photo-36845203.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'Mutton Keema Biryani': 'https://images.pexels.com/photos/36845269/pexels-photo-36845269.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'Apollo Fish': 'https://images.pexels.com/photos/36845284/pexels-photo-36845284.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'Paneer Butter Masala': 'https://images.pexels.com/photos/36845670/pexels-photo-36845670.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'Prawn Fry': 'https://images.pexels.com/photos/36845353/pexels-photo-36845353.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'Gulab Jamun (2pcs)': 'https://images.pexels.com/photos/36845399/pexels-photo-36845399.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'Veg Dum Biryani': 'https://images.pexels.com/photos/36845434/pexels-photo-36845434.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'Special Chicken Biryani': 'https://images.pexels.com/photos/36845478/pexels-photo-36845478.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'Chicken Majestic': 'https://images.pexels.com/photos/36845583/pexels-photo-36845583.png?w=400&h=300&fit=crop&q=70&fm=webp',
  'Butter Chicken': 'https://images.pexels.com/photos/36845594/pexels-photo-36845594.png?w=400&h=300&fit=crop&q=70&fm=webp'
};

async function run() {
  console.log('🚀 STANDARDIZATION PHASE: Syncing exactly 14 items...');

  // 1. Fetch current items
  const { data: currentItems, error: fetchError } = await supabase
    .from('menu_items')
    .select('id, name');

  if (fetchError) {
    console.error('Error fetching items:', fetchError);
    process.exit(1);
  }

  const approvedNames = Object.keys(approvedMapping);

  // 2. Update approved items and track found names
  const foundNames = [];
  for (const item of currentItems) {
    if (approvedNames.includes(item.name)) {
      const newUrl = approvedMapping[item.name];
      console.log(`[UPDATE] ${item.name} -> ${newUrl}`);
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({ image_url: newUrl })
        .eq('id', item.id);
      
      if (updateError) console.error(`Error updating ${item.name}:`, updateError);
      foundNames.push(item.name);
    } else {
      // 3. Delete items NOT in the list
      console.log(`[DELETE] ${item.name} (Not in approved list)`);
      const { error: deleteError } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', item.id);
      
      if (deleteError) console.error(`Error deleting ${item.name}:`, deleteError);
    }
  }

  // 4. Report missing items
  const missingNames = approvedNames.filter(name => !foundNames.includes(name));
  if (missingNames.length > 0) {
    console.warn(`[WARN] The following requested items were NOT found in the database: ${missingNames.join(', ')}`);
  }

  console.log('✅ STANDARDIZATION COMPLETE!');
}

run();
