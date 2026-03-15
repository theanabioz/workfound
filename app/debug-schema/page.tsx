import { createClient } from '@/utils/supabase/server';

export default async function DebugSchema() {
  const supabase = await createClient();
  
  const { data: apps, error: appsError } = await supabase.from('applications').select('*').limit(1);
  const { data: jobs, error: jobsError } = await supabase.from('jobs').select('*').limit(1);
  
  return (
    <pre>
      {JSON.stringify({ appsError, jobsError, apps, jobs }, null, 2)}
    </pre>
  );
}
