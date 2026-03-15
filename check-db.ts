import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function run() {
  const { data: apps, error: appsError } = await supabase.from('applications').select('*').limit(1);
  console.log('Apps error:', appsError);
  
  const { data: jobs, error: jobsError } = await supabase.from('jobs').select('*').limit(1);
  console.log('Jobs error:', jobsError);
}
run();
