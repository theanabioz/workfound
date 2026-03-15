import { createClient } from '@supabase/supabase-js';

async function checkDb() {
  console.log('--- START DB CHECK ---');
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('Missing env vars');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: vacancies, error: vacanciesError } = await supabase.from('vacancies').select('*').limit(1);
    console.log('Vacancies error:', vacanciesError);
    console.log('Vacancies data:', vacancies);
    
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*').limit(1);
    console.log('Profiles error:', profilesError);
    console.log('Profiles data:', profiles);
    
    throw new Error('INTENTIONAL_BUILD_FAILURE_TO_SEE_LOGS');
  } catch (e) {
    console.error('Exception:', e);
    process.exit(1);
  }
  console.log('--- END DB CHECK ---');
}

checkDb();
