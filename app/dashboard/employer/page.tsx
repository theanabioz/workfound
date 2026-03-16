'use client';

import { Briefcase, Users, Eye, Plus, ChevronRight, ArrowUpRight, ArrowDownRight, MoreHorizontal, CheckCircle2, XCircle, Clock, Trash2, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function EmployerDashboard() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    newApplications: 0,
    totalViews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Fetch recent applications
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select(`
            *,
            vacancies!inner (
              title,
              employer_id
            )
          `)
          .eq('vacancies.employer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (appsError) throw appsError;
        setApplications(appsData || []);

        // Fetch stats
        const { count: activeJobsCount, error: jobsError } = await supabase
          .from('vacancies')
          .select('*', { count: 'exact', head: true })
          .eq('employer_id', user.id)
          .eq('status', 'active');

        if (jobsError) {
          console.error('Supabase jobsError:', jobsError);
          throw jobsError;
        }

        const { count: newAppsCount, error: newAppsError } = await supabase
          .from('applications')
          .select('*, vacancies!inner(employer_id)', { count: 'exact', head: true })
          .eq('vacancies.employer_id', user.id)
          .eq('status', 'new');

        if (newAppsError) {
          console.error('Supabase newAppsError:', newAppsError);
          throw newAppsError;
        }

        setStats({
          activeJobs: activeJobsCount || 0,
          newApplications: newAppsCount || 0,
          totalViews: 0 // Placeholder for views if not tracked in DB yet
        });

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(`Не удалось загрузить данные панели управления. Ошибка: ${err.message || JSON.stringify(err)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setApplications(applications.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Не удалось обновить статус.');
    } finally {
      setOpenDropdownId(null);
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Панель управления</h1>
          <p className="text-sm text-zinc-500 mt-1 uppercase tracking-wider font-medium">Сводка по вашим вакансиям и откликам</p>
        </div>
        <Link href="/post-job" className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 uppercase tracking-wider">
          <Plus className="w-4 h-4" />
          Новая вакансия
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 border border-zinc-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Активные вакансии</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-2 font-mono tracking-tight">{stats.activeJobs}</h3>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-200">
              <Briefcase className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 border border-zinc-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Новые отклики</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-2 font-mono tracking-tight">{stats.newApplications}</h3>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-200">
              <Users className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-zinc-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Просмотры вакансий</p>
              <h3 className="text-3xl font-bold text-zinc-900 mt-2 font-mono tracking-tight">{stats.totalViews}</h3>
            </div>
            <div className="p-2 bg-zinc-50 border border-zinc-200">
              <Eye className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
          <h2 className="font-bold text-zinc-900 text-sm uppercase tracking-wider">Недавние отклики кандидатов</h2>
          <Link href="/dashboard/employer/applications" className="text-xs font-bold text-zinc-900 hover:text-zinc-600 flex items-center uppercase tracking-wider transition-colors">
            Открыть CRM <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-white border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-bold">Кандидат</th>
                <th className="px-6 py-4 font-bold">Вакансия</th>
                <th className="px-6 py-4 font-bold">Дата отклика</th>
                <th className="px-6 py-4 font-bold">Статус</th>
                <th className="px-6 py-4 font-bold text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium">
                    У вас пока нет недавних откликов.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-900">{app.contact_email}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 font-medium">{app.vacancies?.title || 'Неизвестная вакансия'}</td>
                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                      {new Date(app.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      {app.status === 'new' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">Новый</span>}
                      {app.status === 'review' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">На рассмотрении</span>}
                      {app.status === 'accepted' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-900 text-white border-zinc-900 whitespace-nowrap">Приглашен</span>}
                      {app.status === 'rejected' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-white text-zinc-500 border-zinc-200 whitespace-nowrap">Отказ</span>}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => toggleDropdown(app.id)}
                        className="text-zinc-400 hover:text-zinc-900 p-1.5 border border-transparent hover:border-zinc-200 hover:bg-white transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openDropdownId === app.id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-8 top-10 w-56 bg-white border border-zinc-200 py-1 z-10 text-left"
                        >
                          <div className="px-4 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 mb-1 bg-zinc-50">
                            Изменить статус
                          </div>
                          <button 
                            onClick={() => updateStatus(app.id, 'new')}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 flex items-center gap-3 transition-colors"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
                            Новый
                          </button>
                          <button 
                            onClick={() => updateStatus(app.id, 'review')}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 flex items-center gap-3 transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            На рассмотрении
                          </button>
                          <button 
                            onClick={() => updateStatus(app.id, 'accepted')}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 flex items-center gap-3 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900" />
                            Приглашен
                          </button>
                          <button 
                            onClick={() => updateStatus(app.id, 'rejected')}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 flex items-center gap-3 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5 text-zinc-400" />
                            Отказ
                          </button>
                          <div className="border-t border-zinc-100 my-1"></div>
                          <Link 
                            href="/dashboard/employer/messages"
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 flex items-center gap-3 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-zinc-400" />
                            Написать сообщение
                          </Link>
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
    </div>
  );
}
