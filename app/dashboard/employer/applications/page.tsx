'use client';

import { Search, Filter, Mail, Download, CheckCircle2, XCircle, Clock, MoreHorizontal, ExternalLink, Trash2, Loader2, User, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import CandidateModal from '@/components/dashboard/CandidateModal';

export default function EmployerApplicationsPage() {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
            ),
            applicant:applicant_id (
              full_name,
              desired_position,
              location,
              about
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

  const filteredApplications = applications.filter(app => {
    const searchLower = searchQuery.toLowerCase();
    const emailMatch = app.contact_email?.toLowerCase().includes(searchLower);
    const nameMatch = app.applicant?.full_name?.toLowerCase().includes(searchLower);
    const jobMatch = app.vacancies?.title?.toLowerCase().includes(searchLower);
    return emailMatch || nameMatch || jobMatch;
  });

  const openCandidateDetails = (app: any) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
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
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Отклики кандидатов</h1>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 text-sm border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors font-medium"
          />
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2.5 bg-zinc-50 text-sm border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 outline-none font-semibold text-zinc-700 uppercase tracking-wider">
            <option>Все вакансии</option>
          </select>
          <button className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Фильтры</span>
          </button>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Кандидат</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap w-1/3">Вакансия</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Дата отклика</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Статус</th>
                <th className="px-6 py-3 font-medium text-right whitespace-nowrap">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium">
                    {searchQuery ? 'Отклики по вашему запросу не найдены.' : 'У вас пока нет откликов.'}
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const applicant = app.applicant;
                  const initials = applicant?.full_name
                    ? applicant.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                    : app.contact_email?.charAt(0).toUpperCase() || '?';

                  return (
                    <tr key={app.id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-zinc-100 text-zinc-600 flex items-center justify-center font-medium text-sm shrink-0 border border-zinc-200">
                            {initials}
                          </div>
                          <div>
                            <div className="font-medium text-zinc-900 flex items-center gap-2">
                              {applicant?.full_name || 'Имя не указано'}
                            </div>
                            <div className="text-[10px] text-zinc-500 mt-0.5 font-medium uppercase tracking-wider">
                              {applicant?.desired_position || 'Соискатель'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-zinc-600">
                        <Link href={`/jobs/${app.vacancy_id}`} className="font-medium text-zinc-900 hover:text-zinc-600 transition-colors flex items-start gap-2 group/link">
                          <span className="line-clamp-2 leading-snug">
                            {app.vacancies?.title || 'Неизвестная вакансия'}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 mt-0.5 opacity-0 group-hover/link:opacity-100 transition-opacity text-zinc-400 shrink-0" />
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-zinc-500 font-mono text-xs whitespace-nowrap">
                        {new Date(app.created_at).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-3">
                        {app.status === 'new' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">Новый</span>}
                        {app.status === 'review' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">На рассмотрении</span>}
                        {app.status === 'accepted' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider border bg-zinc-900 text-white border-zinc-900 whitespace-nowrap">Приглашен</span>}
                        {app.status === 'rejected' && <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider border bg-white text-zinc-500 border-zinc-200 whitespace-nowrap">Отказ</span>}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => openCandidateDetails(app)}
                            className="p-2 text-zinc-400 hover:text-zinc-900 border border-transparent hover:border-zinc-200 hover:bg-white transition-all rounded-sm" 
                            title="Просмотреть профиль"
                          >
                            <User className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openCandidateDetails(app)}
                            className="p-2 text-zinc-400 hover:text-zinc-900 border border-transparent hover:border-zinc-200 hover:bg-white transition-all rounded-sm" 
                            title="Контакты"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                          <Link href={`/dashboard/employer/messages?seekerId=${app.applicant_id}`} className="p-2 text-zinc-400 hover:text-zinc-900 border border-transparent hover:border-zinc-200 hover:bg-white transition-all rounded-sm" title="Написать сообщение">
                            <MessageSquare className="w-4 h-4" />
                          </Link>
                          
                          <div className="w-px h-4 bg-zinc-200 mx-1" />
                          
                          {app.status !== 'accepted' && (
                            <button 
                              onClick={() => handleStatusChange(app.id, 'accepted')}
                              className="p-2 text-zinc-400 hover:text-emerald-600 border border-transparent hover:border-emerald-200 hover:bg-emerald-50 transition-all rounded-sm" 
                              title="Пригласить"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button 
                              onClick={() => handleStatusChange(app.id, 'rejected')}
                              className="p-2 text-zinc-400 hover:text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 transition-all rounded-sm" 
                              title="Отказать"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-zinc-100">
          {filteredApplications.length === 0 ? (
            <div className="px-6 py-12 text-center text-zinc-500 font-medium">
              {searchQuery ? 'Отклики по вашему запросу не найдены.' : 'У вас пока нет откликов.'}
            </div>
          ) : (
            filteredApplications.map((app) => {
              const applicant = app.applicant;
              const initials = applicant?.full_name
                ? applicant.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                : app.contact_email?.charAt(0).toUpperCase() || '?';

              return (
                <div key={app.id} className="p-4 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3" onClick={() => openCandidateDetails(app)}>
                      <div className="w-10 h-10 bg-zinc-100 text-zinc-600 flex items-center justify-center font-bold text-sm shrink-0 border border-zinc-200">
                        {initials}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 text-sm">{applicant?.full_name || 'Имя не указано'}</div>
                        <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{applicant?.desired_position || 'Соискатель'}</div>
                      </div>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => toggleDropdown(app.id)}
                        className="text-zinc-400 hover:text-zinc-900 p-2 border border-zinc-100 bg-zinc-50"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openDropdownId === app.id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-0 top-10 w-max min-w-[12rem] bg-white border border-zinc-200 z-10 py-1 text-left shadow-xl"
                        >
                          <button 
                            onClick={() => openCandidateDetails(app)}
                            className="w-full px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 whitespace-nowrap transition-colors"
                          >
                            <User className="w-4 h-4 text-zinc-400" />
                            Профиль кандидата
                          </button>
                          <Link href={`/dashboard/employer/messages?seekerId=${app.applicant_id}`} className="w-full px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 whitespace-nowrap transition-colors">
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
                    </div>
                  </div>

                <div className="bg-zinc-50 p-3 space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    <span>Вакансия</span>
                    <span>Статус</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <Link href={`/jobs/${app.vacancy_id}`} className="font-bold text-zinc-900 text-xs truncate">
                      {app.vacancies?.title || 'Неизвестная вакансия'}
                    </Link>
                    <div>
                      {app.status === 'new' && <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">Новый</span>}
                      {app.status === 'review' && <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300 whitespace-nowrap">На рассмотрении</span>}
                      {app.status === 'accepted' && <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border bg-zinc-900 text-white border-zinc-900 whitespace-nowrap">Приглашен</span>}
                      {app.status === 'rejected' && <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border bg-white text-zinc-500 border-zinc-200 whitespace-nowrap">Отказ</span>}
                    </div>
                  </div>
                  <div className="pt-1 text-[10px] text-zinc-400 font-mono">
                    Отклик от {new Date(app.created_at).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>

      <CandidateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        application={selectedApplication}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
