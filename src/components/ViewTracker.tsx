'use client';
import { useEffect } from 'react';
import { incrementJobView } from '@/app/jobs/actions';

export function ViewTracker({ jobId }: { jobId: string }) {
  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('viewed_jobs') || '[]');
    
    if (!viewed.includes(jobId)) {
      incrementJobView(jobId);
      
      viewed.push(jobId);
      localStorage.setItem('viewed_jobs', JSON.stringify(viewed));
    }
  }, [jobId]);

  return null;
}
