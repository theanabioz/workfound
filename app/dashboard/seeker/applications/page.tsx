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
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-emerald-100 text-emerald-700 border-emerald-200 whitespace-nowrap">Приглашение</span>;
      case 'review':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-blue-100 text-blue-700 border-blue-200 whitespace-nowrap">Просмотрено</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-red-100 text-red-700 border-red-200 whitespace-nowrap">Отказ</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-slate-100 text-slate-700 border-slate-200 whitespace-nowrap">Отправлено</span>;
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
          <h1 className="text-2xl font-semibold text-slate-900">Мои отклики</h1>
          <p className="text-sm text-slate-500 mt-1">История откликов на вакансии</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-medium">Вакансия</th>
                <th className="px-5 py-3 font-medium">Компания</th>
                <th className="px-5 py-3 font-medium">Дата отклика</th>
                <th className="px-5 py-3 font-medium">Статус</th>
                <th className="px-5 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    У вас пока нет откликов на вакансии.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3">
                      <Link href={`/jobs/${app.vacancy_id}`} className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        {app.vacancies?.title || 'Неизвестная вакансия'}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <div className="text-xs text-slate-500 mt-0.5">{app.vacancies?.location} • {app.vacancies?.salary}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-600 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {app.vacancies?.employer?.full_name || 'Прямой работодатель'}
                    </td>
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs">
                      {new Date(app.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-5 py-3">
                      {getStatusBadge(app.status)}
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
