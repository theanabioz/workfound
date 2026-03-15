'use client';

import JobCard from '@/components/jobs/JobCard';
import { useState, useEffect } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function SavedJobsPage() {
  const supabase = createClient();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSavedJobs() {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Необходима авторизация');
      }

      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          id,
          vacancy_id,
          vacancies (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedJobs = data?.map((item: any) => ({
        saved_id: item.id,
        ...item.vacancies,
        postedAt: item.vacancies?.created_at ? new Date(item.vacancies.created_at).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'short'
        }) : ''
      })) || [];

      setSavedJobs(formattedJobs);
    } catch (err: any) {
      console.error('Error fetching saved jobs:', err);
      setError('Не удалось загрузить сохраненные вакансии.');
    } finally {
      setIsLoading(false);
    }
  }

  const removeJob = async (savedId: string) => {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('id', savedId);

      if (error) throw error;
      
      setSavedJobs(savedJobs.filter(job => job.saved_id !== savedId));
    } catch (err) {
      console.error('Error removing saved job:', err);
      alert('Ошибка при удалении из сохраненных');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Сохраненные вакансии</h1>
          <p className="text-sm text-slate-500 mt-1">Вакансии, которые вы добавили в избранное</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">У вас нет сохраненных вакансий.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Перейти к поиску вакансий</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedJobs.map((job) => (
            <div key={job.saved_id} className="relative group">
              <JobCard 
                id={job.id}
                title={job.title}
                company={job.company_name || 'Прямой работодатель'}
                location={job.location}
                salary={job.salary}
                tags={job.benefits || []}
                postedAt={job.postedAt}
              />
              <button 
                onClick={() => removeJob(job.saved_id)}
                className="absolute top-4 right-4 p-2 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                title="Удалить из сохраненных"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
