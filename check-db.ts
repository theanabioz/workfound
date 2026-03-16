import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function run() {
  const { data: apps, error: appsError } = await supabase.from('applications').select('*').limit(1);
  console.log('Apps error:', appsError);
  
  const { data: vacancies, error: jobsError } = await supabase.from('vacancies').select('*').limit(1);
  console.log('Vacancies error:', jobsError);
}
run();
