'use server';

import { getCurrentUser, getEmployerJobs } from '@/lib/supabase-service';

export async function getMyCompanyJobsAction() {
  const user = await getCurrentUser();
  if (!user) return [];
  return getEmployerJobs(user.id);
}
