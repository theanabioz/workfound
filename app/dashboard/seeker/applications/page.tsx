'use client';

import { Building2, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, MoreHorizontal, ExternalLink, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ApplicationsPage() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [appToDelete, setAppToDelete] = useState<string | null>(null);
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
            vacancies (
              title,
              location,
              salary,
              employer:employer_id (
                full_name
              )
            )
          `)
          .eq('applicant_id', user.id)
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

  const confirmDelete = async () => {
    if (appToDelete !== null) {
      try {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', appToDelete);

        if (error) throw error;

        setApplications(applications.filter(app => app.id !== appToDelete));
      } catch (err) {
        console.error('Error deleting application:', err);
        alert('Не удалось отозвать отклик.');
      } finally {
        setAppToDelete(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-900 text-white border-zinc-900 whitespace-nowrap">Приглашение</span>;
      case 'review':
        return <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">Просмотрено</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-white text-zinc-500 border-zinc-200 whitespace-nowrap">Отказ</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">Отправлено</span>;
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
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Мои отклики</h1>
          <p className="text-sm text-zinc-500 mt-1 uppercase tracking-wider font-medium">История откликов на вакансии</p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Вакансия</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Компания</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Дата отклика</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Статус</th>
                <th className="px-6 py-4 font-bold text-right whitespace-nowrap">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium">
                    У вас пока нет откликов на вакансии.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/jobs/${app.vacancy_id}`} className="font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-2 transition-colors">
                        {app.vacancies?.title || 'Неизвестная вакансия'}
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                      </Link>
                      <div className="text-xs text-zinc-500 mt-1 font-medium">{app.vacancies?.location} • {app.vacancies?.salary}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 flex items-center gap-2 font-medium">
                      <Building2 className="w-4 h-4 text-zinc-400" />
                      {app.vacancies?.employer?.full_name || 'Прямой работодатель'}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
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
