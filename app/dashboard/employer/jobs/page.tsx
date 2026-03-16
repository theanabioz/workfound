'use client';

import Link from 'next/link';
import { Plus, MoreHorizontal, ExternalLink, Edit, Eye, EyeOff, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function EmployerJobsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchJobs() {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Необходима авторизация');
      }

      const { data: jobsData, error: jobsError } = await supabase
        .from('vacancies')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsError) {
        console.error('Supabase jobsError:', jobsError);
        throw jobsError;
      }
      
      // Fetch application counts for these jobs
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select('vacancy_id');
        
      if (applicationsError) {
        console.error('Supabase applicationsError:', applicationsError);
        throw applicationsError;
      }
      
      const applicationCounts = applicationsData.reduce((acc: Record<string, number>, app) => {
        acc[app.vacancy_id] = (acc[app.vacancy_id] || 0) + 1;
        return acc;
      }, {});

      const formattedJobs = jobsData?.map(job => ({
        ...job,
        views: job.views || 0,
        applications: applicationCounts[job.id] || 0,
        postedAt: new Date(job.created_at).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      })) || [];

      setJobs(formattedJobs);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      setError(`Не удалось загрузить вакансии: ${err.message || 'Неизвестная ошибка'}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const updateJobStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('vacancies')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Ошибка при обновлении статуса');
    } finally {
      setOpenDropdownId(null);
    }
  };

  const handleActivate = (id: string) => updateJobStatus(id, 'active');
  const handleDeactivate = (id: string) => updateJobStatus(id, 'closed');

  const handleEdit = (id: string) => {
    setOpenDropdownId(null);
    router.push(`/post-job?edit=${id}`);
  };

  const confirmDelete = async () => {
    if (jobToDelete !== null) {
      try {
        const { error } = await supabase
          .from('vacancies')
          .delete()
          .eq('id', jobToDelete);

        if (error) throw error;
        
        setJobs(jobs.filter(job => job.id !== jobToDelete));
      } catch (err) {
        console.error('Error deleting job:', err);
        alert('Ошибка при удалении вакансии');
      } finally {
        setJobToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Мои вакансии</h1>
          <p className="text-sm text-slate-500 mt-1">Управление размещенными вакансиями</p>
        </div>
        <Link href="/post-job" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Новая вакансия
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-medium">Вакансия</th>
                <th className="px-5 py-3 font-medium">Статус</th>
                <th className="px-5 py-3 font-medium">Дата публикации</th>
                <th className="px-5 py-3 font-medium text-right">Просмотры</th>
                <th className="px-5 py-3 font-medium text-right">Отклики</th>
                <th className="px-5 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                    Загрузка вакансий...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    У вас пока нет размещенных вакансий.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3 max-w-[200px] sm:max-w-[300px]">
                      <Link href={`/jobs/${job.id}`} className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1" title={job.title}>
                        <span className="truncate">{job.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      {job.status === 'active' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-emerald-100 text-emerald-700 border-emerald-200">Активна</span>}
                      {job.status === 'draft' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-amber-100 text-amber-700 border-amber-200">Черновик</span>}
                      {job.status === 'closed' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-slate-100 text-slate-700 border-slate-200">Закрыта</span>}
                    </td>
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs">{job.postedAt}</td>
                    <td className="px-5 py-3 text-right text-slate-600 font-mono text-xs">{job.views}</td>
                    <td className="px-5 py-3 text-right">
                      {job.applications > 0 ? (
                        <Link href={`/dashboard/employer/applications?jobId=${job.id}`} className="text-blue-600 font-medium hover:underline font-mono text-xs">
                          {job.applications}
                        </Link>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs">0</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right relative">
                      <button 
                        onClick={() => toggleDropdown(job.id)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {openDropdownId === job.id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-5 top-10 w-max min-w-[12rem] bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1 text-left"
                        >
                          <button 
                            onClick={() => handleEdit(job.id)}
                            className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap"
                          >
                            <Edit className="w-4 h-4 text-slate-400" />
                            Редактировать
                          </button>
                          {job.status !== 'active' ? (
                            <button 
                              onClick={() => handleActivate(job.id)}
                              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap"
                            >
                              <Eye className="w-4 h-4 text-slate-400" />
                              Активировать
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleDeactivate(job.id)}
                              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap"
                            >
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              Деактивировать
                            </button>
                          )}
                          <div className="h-px bg-slate-200 my-1"></div>
                          <button 
                            onClick={() => {
                              setJobToDelete(job.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 whitespace-nowrap"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                            Удалить
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {jobToDelete !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Удалить вакансию?</h3>
              <p className="text-sm text-slate-500">
                Это действие нельзя отменить. Вакансия и все отклики на нее будут безвозвратно удалены из системы.
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200">
              <button 
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-md transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
