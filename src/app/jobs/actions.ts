'use server';
import { createClient } from '@/utils/supabase/server';

export async function incrementJobView(jobId: string) {
  const supabase = await createClient();
  await supabase.rpc('increment_job_views', { row_id: jobId });
}
