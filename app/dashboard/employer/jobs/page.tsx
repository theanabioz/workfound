'use client';

import Link from 'next/link';
import { Plus, MoreHorizontal, ExternalLink, Edit, Eye, EyeOff, Trash2, AlertTriangle, Loader2, Search, Filter } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredJobs = jobs.filter(job => {
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = job.title?.toLowerCase().includes(searchLower);
    const descMatch = job.description?.toLowerCase().includes(searchLower);
    const locMatch = job.location?.toLowerCase().includes(searchLower);
    const salaryMatch = job.salary?.toLowerCase().includes(searchLower);
    const catMatch = job.category?.toLowerCase().includes(searchLower);
    const tagsMatch = Array.isArray(job.tags) && job.tags.some((tag: string) => tag.toLowerCase().includes(searchLower));
    
    return titleMatch || descMatch || locMatch || salaryMatch || catMatch || tagsMatch;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Мои вакансии</h1>
          <p className="text-sm text-zinc-500 mt-1 uppercase tracking-wider font-medium">Управление размещенными вакансиями</p>
        </div>
        <Link href="/post-job" className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Новая вакансия
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 border border-zinc-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3" />
          <input 
            type="text" 
            placeholder="Поиск по названию, описанию или тегам..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 text-sm border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors font-medium"
          />
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2.5 bg-zinc-50 text-sm border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 outline-none font-bold text-zinc-700 uppercase tracking-wider">
            <option>Все статусы</option>
            <option>Активные</option>
            <option>Черновики</option>
            <option>Закрытые</option>
          </select>
          <button className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Фильтры</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Вакансия</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Статус</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Дата публикации</th>
                <th className="px-6 py-4 font-bold text-right whitespace-nowrap">Просмотры</th>
                <th className="px-6 py-4 font-bold text-right whitespace-nowrap">Отклики</th>
                <th className="px-6 py-4 font-bold text-right whitespace-nowrap">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 font-medium">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-zinc-900" />
                    Загрузка вакансий...
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 font-medium">
                    {searchQuery ? 'Вакансии по вашему запросу не найдены.' : 'У вас пока нет размещенных вакансий.'}
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4 max-w-[200px] sm:max-w-[300px]">
                      <Link href={`/jobs/${job.id}`} className="font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-2 transition-colors" title={job.title}>
                        <span className="truncate">{job.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {job.status === 'active' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-900 text-white border-zinc-900">Активна</span>}
                      {job.status === 'draft' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300">Черновик</span>}
                      {job.status === 'closed' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-white text-zinc-500 border-zinc-200">Закрыта</span>}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs whitespace-nowrap">{job.postedAt}</td>
                    <td className="px-6 py-4 text-right text-zinc-600 font-mono text-xs">{job.views}</td>
                    <td className="px-6 py-4 text-right">
                      {job.applications > 0 ? (
                        <Link href={`/dashboard/employer/applications?jobId=${job.id}`} className="text-zinc-900 font-bold hover:underline font-mono text-xs">
                          {job.applications}
                        </Link>
                      ) : (
                        <span className="text-zinc-400 font-mono text-xs">0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => toggleDropdown(job.id)}
                        className="text-zinc-400 hover:text-zinc-900 p-1.5 border border-transparent hover:border-zinc-200 hover:bg-white transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {openDropdownId === job.id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-8 top-10 w-max min-w-[12rem] bg-white border border-zinc-200 z-10 py-1 text-left"
                        >
                          <button 
                            onClick={() => handleEdit(job.id)}
                            className="w-full px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 whitespace-nowrap transition-colors"
                          >
                            <Edit className="w-4 h-4 text-zinc-400" />
                            Редактировать
                          </button>
                          {job.status !== 'active' ? (
                            <button 
                              onClick={() => handleActivate(job.id)}
                              className="w-full px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 whitespace-nowrap transition-colors"
                            >
                              <Eye className="w-4 h-4 text-zinc-400" />
                              Активировать
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleDeactivate(job.id)}
                              className="w-full px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 whitespace-nowrap transition-colors"
                            >
                              <EyeOff className="w-4 h-4 text-zinc-400" />
                              Деактивировать
                            </button>
                          )}
                          <div className="h-px bg-zinc-100 my-1"></div>
                          <button 
                            onClick={() => {
                              setJobToDelete(job.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 whitespace-nowrap transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
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
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white border border-zinc-200 max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="w-12 h-12 border border-red-200 bg-red-50 flex items-center justify-center mb-6">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight">Удалить вакансию?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Это действие нельзя отменить. Вакансия и все отклики на нее будут безвозвратно удалены из системы.
              </p>
            </div>
            <div className="bg-zinc-50 px-8 py-5 flex items-center justify-end gap-3 border-t border-zinc-200">
              <button 
                onClick={() => setJobToDelete(null)}
                className="px-6 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 bg-zinc-100 border border-zinc-300 uppercase tracking-wider transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={confirmDelete}
                className="px-6 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 uppercase tracking-wider transition-colors"
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
