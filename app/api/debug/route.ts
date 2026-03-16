import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data: apps, error: appsError } = await supabase.from('applications').select('*').limit(1);
  const { data: jobs, error: jobsError } = await supabase.from('vacancies').select('*').limit(1);
  
  return NextResponse.json({
    appsError,
    jobsError,
    apps,
    jobs
  });
}
