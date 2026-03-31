import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://quecpuwlmbtdbitbvrpr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZWNwdXdsbWJ0ZGJpdGJ2cnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzAxMDksImV4cCI6MjA5MDQ0NjEwOX0.kG7YIZ0XMdkp6eblh8JSkluwO5nD7m6yr45-CTqlCho';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('id, name, category');

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
}

run();
