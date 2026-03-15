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
            jobs (
              title,
              company_name
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Личный кабинет</h1>
          <p className="text-sm text-slate-500 mt-1">{userEmail || 'Соискатель'}</p>
        </div>
        <Link href="/" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
          Поиск вакансий
        </Link>
      </div>

      {/* Profile Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Профиль заполнен на 80%</h3>
            <p className="text-xs text-blue-700 mt-1">Добавьте информацию о знании языков для повышения видимости резюме.</p>
          </div>
        </div>
        <Link href="/dashboard/seeker/resume" className="shrink-0 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md text-xs font-medium transition-colors">
          Обновить резюме
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Мои отклики</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">{stats.totalApplications}</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Send className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Приглашения</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">{stats.invitations}</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Сохраненные</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">{stats.savedJobs}</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Bookmark className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-semibold text-slate-800 text-sm">История откликов</h2>
          <Link href="/dashboard/seeker/applications" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center">
            Все отклики <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        <div className="overflow-x-auto min-h-[200px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-medium">Компания</th>
                <th className="px-5 py-3 font-medium">Вакансия</th>
                <th className="px-5 py-3 font-medium">Дата</th>
                <th className="px-5 py-3 font-medium">Статус</th>
                <th className="px-5 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    У вас пока нет недавних откликов.
                  </td>
                </tr>
              ) : (
                recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-900">{app.jobs?.company_name || 'Неизвестная компания'}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{app.jobs?.title || 'Неизвестная вакансия'}</td>
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs">
                      {new Date(app.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-5 py-3">
                      {app.status === 'new' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-blue-100 text-blue-700 border-blue-200 whitespace-nowrap">Отправлено</span>}
                      {app.status === 'review' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-amber-100 text-amber-700 border-amber-200 whitespace-nowrap">Просмотрено</span>}
                      {app.status === 'accepted' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-emerald-100 text-emerald-700 border-emerald-200 whitespace-nowrap">Приглашение</span>}
                      {app.status === 'rejected' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-slate-100 text-slate-700 border-slate-200 whitespace-nowrap">Отказ</span>}
                    </td>
                    <td className="px-5 py-3 text-right relative">
                      {app.status === 'accepted' ? (
                        <Link href="/dashboard/seeker/messages" className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors inline-block">
                          Чат
                        </Link>
                      ) : (
                        <>
                          <button 
                            onClick={() => toggleDropdown(app.id)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          
                          {openDropdownId === app.id && (
                            <div 
                              ref={dropdownRef}
                              className="absolute right-5 top-10 w-max min-w-[12rem] bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1 text-left"
                            >
                              <button 
                                onClick={() => {
                                  setAppToDelete(app.id);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 whitespace-nowrap"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Отозвать отклик?</h3>
              <p className="text-sm text-slate-500">
                Вы уверены, что хотите отозвать свой отклик на эту вакансию? Работодатель больше не сможет просматривать ваше резюме в рамках этой заявки.
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200">
              <button 
                onClick={() => setAppToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-md transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
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
