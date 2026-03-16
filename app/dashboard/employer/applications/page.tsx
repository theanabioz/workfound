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
            vacancies!inner (
              title,
              employer_id
            )
          `)
          .eq('vacancies.employer_id', user.id)
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Отклики кандидатов</h1>
          <p className="text-sm text-zinc-500 mt-1 uppercase tracking-wider font-medium">Управление кандидатами на ваши вакансии</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 border border-zinc-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3" />
          <input 
            type="text" 
            placeholder="Поиск по имени или должности..." 
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 text-sm border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors font-medium"
          />
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2.5 bg-zinc-50 text-sm border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 outline-none font-bold text-zinc-700 uppercase tracking-wider">
            <option>Все вакансии</option>
          </select>
          <button className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Фильтры</span>
          </button>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Кандидат</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Вакансия</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Дата отклика</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Статус</th>
                <th className="px-6 py-4 font-bold text-right whitespace-nowrap">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium">
                    У вас пока нет откликов.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-100 text-zinc-600 flex items-center justify-center font-bold text-sm shrink-0 border border-zinc-200">
                          {app.contact_email ? app.contact_email.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900 flex items-center gap-2">
                            {app.contact_email}
                          </div>
                          <div className="text-xs text-zinc-500 mt-1 font-medium">Телефон: {app.contact_phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      <Link href={`/jobs/${app.vacancy_id}`} className="font-semibold text-zinc-900 hover:text-zinc-600 transition-colors flex items-center gap-2">
                        {app.vacancies?.title || 'Неизвестная вакансия'}
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      {app.status === 'new' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">Новый</span>}
                      {app.status === 'review' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">На рассмотрении</span>}
                      {app.status === 'accepted' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-900 text-white border-zinc-900 whitespace-nowrap">Приглашен</span>}
                      {app.status === 'rejected' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-white text-zinc-500 border-zinc-200 whitespace-nowrap">Отказ</span>}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href="/dashboard/employer/messages" className="p-2 text-zinc-400 hover:text-zinc-900 border border-transparent hover:border-zinc-200 hover:bg-white transition-all" title="Написать сообщение">
                          <Mail className="w-4 h-4" />
                        </Link>
                        {app.status !== 'accepted' && (
                          <button 
                            onClick={() => handleStatusChange(app.id, 'accepted')}
                            className="p-2 text-zinc-400 hover:text-emerald-600 border border-transparent hover:border-emerald-200 hover:bg-emerald-50 transition-all" 
                            title="Пригласить"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button 
                            onClick={() => handleStatusChange(app.id, 'rejected')}
                            className="p-2 text-zinc-400 hover:text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 transition-all" 
                            title="Отказать"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {/* Mobile Actions Dropdown */}
                      <button 
                        onClick={() => toggleDropdown(app.id)}
                        className="p-2 text-zinc-400 hover:text-zinc-900 border border-transparent hover:border-zinc-200 hover:bg-white transition-all md:hidden absolute right-6 top-1/2 -translate-y-1/2"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {openDropdownId === app.id && (
                        <div 
                          ref={dropdownRef}
                          className="md:hidden absolute right-8 top-10 w-max min-w-[12rem] bg-white border border-zinc-200 z-10 py-1 text-left"
                        >
                          <Link href="/dashboard/employer/messages" className="w-full px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 whitespace-nowrap transition-colors">
                            <Mail className="w-4 h-4 text-zinc-400" />
                            Написать сообщение
                          </Link>
                          {app.status !== 'accepted' && (
                            <button 
                              onClick={() => handleStatusChange(app.id, 'accepted')}
                              className="w-full px-4 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-3 whitespace-nowrap transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              Пригласить
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button 
                              onClick={() => handleStatusChange(app.id, 'rejected')}
                              className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 whitespace-nowrap transition-colors"
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
