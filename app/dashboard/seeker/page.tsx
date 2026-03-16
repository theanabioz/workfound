'use client';

import { FileText, Send, Bookmark, ChevronRight, CheckCircle2, AlertCircle, MoreHorizontal, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function SeekerDashboard() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [appToDelete, setAppToDelete] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    invitations: 0,
    savedJobs: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('Пользователь не авторизован');
          setIsLoading(false);
          return;
        }

        setUserEmail(user.email || null);

        // Fetch recent applications
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            created_at,
            vacancies (
              title,
              employer:employer_id (
                full_name
              )
            )
          `)
          .eq('applicant_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (appsError) throw appsError;
        setRecentApps(appsData || []);

        // Fetch stats
        const { count: totalAppsCount, error: totalAppsError } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('applicant_id', user.id);

        if (totalAppsError) throw totalAppsError;

        const { count: invitationsCount, error: invitationsError } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('applicant_id', user.id)
          .eq('status', 'accepted');

        if (invitationsError) throw invitationsError;

        const { count: savedJobsCount, error: savedJobsError } = await supabase
          .from('saved_jobs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (savedJobsError) throw savedJobsError;

        setStats({
          totalApplications: totalAppsCount || 0,
          invitations: invitationsCount || 0,
          savedJobs: savedJobsCount || 0
        });

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError('Не удалось загрузить данные панели управления.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const confirmDelete = async () => {
    if (appToDelete !== null) {
      try {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', appToDelete);

        if (error) throw error;

        setRecentApps(recentApps.filter(app => app.id !== appToDelete));
        setStats(prev => ({ ...prev, totalApplications: Math.max(0, prev.totalApplications - 1) }));
      } catch (err) {
        console.error('Error deleting application:', err);
        alert('Не удалось отозвать отклик.');
      } finally {
        setAppToDelete(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 border border-red-200 text-sm font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Личный кабинет</h1>
          <p className="text-sm text-zinc-500 mt-1 uppercase tracking-wider font-medium">{userEmail || 'Соискатель'}</p>
        </div>
        <Link href="/" className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 text-sm font-medium transition-colors uppercase tracking-wider">
          Поиск вакансий
        </Link>
      </div>

      {/* Profile Alert */}
      <div className="bg-zinc-50 border border-zinc-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-zinc-900 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Профиль заполнен на 80%</h3>
            <p className="text-xs text-zinc-600 mt-1">Добавьте информацию о знании языков для повышения видимости резюме.</p>
          </div>
        </div>
        <Link href="/dashboard/seeker/resume" className="shrink-0 bg-white border border-zinc-300 text-zinc-900 hover:bg-zinc-50 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors">
          Обновить резюме
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 border border-zinc-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Мои отклики</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-2 font-mono tracking-tight">{stats.totalApplications}</h3>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-200">
              <Send className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 border border-zinc-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Приглашения</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-2 font-mono tracking-tight">{stats.invitations}</h3>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-200">
              <CheckCircle2 className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-zinc-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Сохраненные</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-2 font-mono tracking-tight">{stats.savedJobs}</h3>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-200">
              <Bookmark className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
          <h2 className="font-bold text-zinc-900 text-sm uppercase tracking-wider">История откликов</h2>
          <Link href="/dashboard/seeker/applications" className="text-xs font-bold text-zinc-900 hover:text-zinc-600 flex items-center uppercase tracking-wider transition-colors">
            Все отклики <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto min-h-[200px]">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-white border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-bold">Компания</th>
                <th className="px-6 py-4 font-bold">Вакансия</th>
                <th className="px-6 py-4 font-bold">Дата</th>
                <th className="px-6 py-4 font-bold">Статус</th>
                <th className="px-6 py-4 font-bold text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {recentApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium">
                    У вас пока нет недавних откликов.
                  </td>
                </tr>
              ) : (
                recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-900">{app.vacancies?.employer?.full_name || 'Неизвестная компания'}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 font-medium">{app.vacancies?.title || 'Неизвестная вакансия'}</td>
                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                      {new Date(app.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      {app.status === 'new' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">Отправлено</span>}
                      {app.status === 'review' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">Просмотрено</span>}
                      {app.status === 'accepted' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-900 text-white border-zinc-900 whitespace-nowrap">Приглашение</span>}
                      {app.status === 'rejected' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-white text-zinc-500 border-zinc-200 whitespace-nowrap">Отказ</span>}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      {app.status === 'accepted' ? (
                        <Link href="/dashboard/seeker/messages" className="text-[10px] font-bold text-zinc-900 hover:text-white bg-zinc-100 hover:bg-zinc-900 border border-zinc-300 hover:border-zinc-900 px-4 py-2 uppercase tracking-wider transition-colors inline-block">
                          Чат
                        </Link>
                      ) : (
                        <>
                          <button 
                            onClick={() => toggleDropdown(app.id)}
                            className="text-zinc-400 hover:text-zinc-900 p-1.5 border border-transparent hover:border-zinc-200 hover:bg-white transition-all"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {openDropdownId === app.id && (
                            <div 
                              ref={dropdownRef}
                              className="absolute right-8 top-10 w-max min-w-[12rem] bg-white border border-zinc-200 z-10 py-1 text-left"
                            >
                              <button 
                                onClick={() => {
                                  setAppToDelete(app.id);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 whitespace-nowrap transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                                Отозвать отклик
                              </button>
                            </div>
                          )}
                        </>
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
      {appToDelete !== null && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white border border-zinc-200 max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="w-12 h-12 border border-red-200 bg-red-50 flex items-center justify-center mb-6">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight">Отозвать отклик?</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Вы уверены, что хотите отозвать свой отклик на эту вакансию? Работодатель больше не сможет просматривать ваше резюме в рамках этой заявки.
              </p>
            </div>
            <div className="bg-zinc-50 px-8 py-5 flex items-center justify-end gap-3 border-t border-zinc-200">
              <button 
                onClick={() => setAppToDelete(null)}
                className="px-6 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 bg-zinc-100 border border-zinc-300 uppercase tracking-wider transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={confirmDelete}
                className="px-6 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 uppercase tracking-wider transition-colors"
              >
                Отозвать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
