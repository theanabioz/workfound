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
            jobs (
              title
            )
          `)
          .eq('employer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (appsError) throw appsError;
        setApplications(appsData || []);

        // Fetch stats
        const { count: activeJobsCount, error: jobsError } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('employer_id', user.id)
          .eq('status', 'active');

        if (jobsError) throw jobsError;

        const { count: newAppsCount, error: newAppsError } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('employer_id', user.id)
          .eq('status', 'new');

        if (newAppsError) throw newAppsError;

        setStats({
          activeJobs: activeJobsCount || 0,
          newApplications: newAppsCount || 0,
          totalViews: 0 // Placeholder for views if not tracked in DB yet
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Панель управления</h1>
          <p className="text-sm text-slate-500 mt-1">Сводка по вашим вакансиям и откликам</p>
        </div>
        <Link href="/post-job" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Новая вакансия
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Активные вакансии</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">{stats.activeJobs}</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Briefcase className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Новые отклики</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">{stats.newApplications}</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Users className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Просмотры вакансий</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">{stats.totalViews}</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Eye className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-semibold text-slate-800 text-sm">Недавние отклики кандидатов</h2>
          <Link href="/dashboard/employer/applications" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center">
            Открыть CRM <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-medium">Кандидат</th>
                <th className="px-5 py-3 font-medium">Вакансия</th>
                <th className="px-5 py-3 font-medium">Дата отклика</th>
                <th className="px-5 py-3 font-medium">Статус</th>
                <th className="px-5 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    У вас пока нет недавних откликов.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-900">{app.contact_email}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{app.jobs?.title || 'Неизвестная вакансия'}</td>
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs">
                      {new Date(app.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-5 py-3">
                      {app.status === 'new' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-blue-100 text-blue-700 border-blue-200 whitespace-nowrap">Новый</span>}
                      {app.status === 'review' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-amber-100 text-amber-700 border-amber-200 whitespace-nowrap">На рассмотрении</span>}
                      {app.status === 'accepted' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-emerald-100 text-emerald-700 border-emerald-200 whitespace-nowrap">Приглашен</span>}
                      {app.status === 'rejected' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-slate-100 text-slate-700 border-slate-200 whitespace-nowrap">Отказ</span>}
                    </td>
                    <td className="px-5 py-3 text-right relative">
                      <button 
                        onClick={() => toggleDropdown(app.id)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openDropdownId === app.id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-8 top-10 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10 text-left"
                        >
                          <div className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-100 mb-1">
                            Изменить статус
                          </div>
                          <button 
                            onClick={() => updateStatus(app.id, 'new')}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Новый
                          </button>
                          <button 
                            onClick={() => updateStatus(app.id, 'review')}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Clock className="w-3 h-3 text-slate-500" />
                            На рассмотрении
                          </button>
                          <button 
                            onClick={() => updateStatus(app.id, 'accepted')}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Приглашен
                          </button>
                          <button 
                            onClick={() => updateStatus(app.id, 'rejected')}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <XCircle className="w-3 h-3 text-rose-500" />
                            Отказ
                          </button>
                          <div className="border-t border-slate-100 my-1"></div>
                          <Link 
                            href="/dashboard/employer/messages"
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Mail className="w-3 h-3 text-slate-500" />
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
