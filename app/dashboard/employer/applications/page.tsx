'use client';

import { Search, Filter, Mail, Download, CheckCircle2, XCircle, Clock, MoreHorizontal, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function EmployerApplicationsPage() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const [applications, setApplications] = useState<any[]>([]);
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
    const fetchApplications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('Пользователь не авторизован');
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            jobs (
              title
            )
          `)
          .eq('employer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setApplications(data || []);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError('Не удалось загрузить отклики.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [supabase]);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
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
    <div className="space-y-6 max-w-7xl mx-auto relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Отклики кандидатов</h1>
          <p className="text-sm text-slate-500 mt-1">Управление кандидатами на ваши вакансии</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Поиск по имени или должности..." 
            className="w-full pl-9 pr-3 py-2 bg-slate-50 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 bg-slate-50 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none font-medium text-slate-700">
            <option>Все вакансии</option>
          </select>
          <button className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Фильтры</span>
          </button>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
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
                    У вас пока нет откликов.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                          {app.contact_email ? app.contact_email.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 flex items-center gap-2">
                            {app.contact_email}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">Телефон: {app.contact_phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <Link href={`/jobs/${app.job_id}`} className="hover:text-blue-600 transition-colors flex items-center gap-1">
                        {app.jobs?.title || 'Неизвестная вакансия'}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                      </Link>
                    </td>
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
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href="/dashboard/employer/messages" className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors" title="Написать сообщение">
                          <Mail className="w-4 h-4" />
                        </Link>
                        {app.status !== 'accepted' && (
                          <button 
                            onClick={() => handleStatusChange(app.id, 'accepted')}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded hover:bg-emerald-50 transition-colors" 
                            title="Пригласить"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button 
                            onClick={() => handleStatusChange(app.id, 'rejected')}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors" 
                            title="Отказать"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {/* Mobile Actions Dropdown */}
                      <button 
                        onClick={() => toggleDropdown(app.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors md:hidden absolute right-5 top-1/2 -translate-y-1/2"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {openDropdownId === app.id && (
                        <div 
                          ref={dropdownRef}
                          className="md:hidden absolute right-5 top-10 w-max min-w-[12rem] bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1 text-left"
                        >
                          <Link href="/dashboard/employer/messages" className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap">
                            <Mail className="w-4 h-4 text-slate-400" />
                            Написать сообщение
                          </Link>
                          {app.status !== 'accepted' && (
                            <button 
                              onClick={() => handleStatusChange(app.id, 'accepted')}
                              className="w-full px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 whitespace-nowrap"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              Пригласить
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button 
                              onClick={() => handleStatusChange(app.id, 'rejected')}
                              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 whitespace-nowrap"
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                              Отказать
                            </button>
                          )}
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
