'use client';

import { Search, Filter, Mail, Download, CheckCircle2, XCircle, Clock, MoreHorizontal, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function EmployerApplicationsPage() {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Алексей Смирнов',
      job: 'Водитель-дальнобойщик категории CE',
      experience: '5 лет',
      appliedAt: '15 Мар 2026, 10:30',
      status: 'new',
      matchScore: 95,
    },
    {
      id: 2,
      name: 'Иван Петров',
      job: 'Сварщик MIG/MAG',
      experience: '3 года',
      appliedAt: '14 Мар 2026, 15:45',
      status: 'review',
      matchScore: 82,
    },
    {
      id: 3,
      name: 'Сергей Иванов',
      job: 'Водитель-дальнобойщик категории CE',
      experience: '8 лет',
      appliedAt: '10 Мар 2026, 09:15',
      status: 'interview',
      matchScore: 98,
    },
    {
      id: 4,
      name: 'Дмитрий Волков',
      job: 'Разнорабочий на склад',
      experience: 'Без опыта',
      appliedAt: '09 Мар 2026, 11:20',
      status: 'rejected',
      matchScore: 45,
    }
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, status: newStatus } : c));
    setOpenDropdownId(null);
  };

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
            <option>Водитель-дальнобойщик</option>
            <option>Сварщик MIG/MAG</option>
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
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    У вас пока нет откликов.
                  </td>
                </tr>
              ) : (
                candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 flex items-center gap-2">
                            {candidate.name}
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                              {candidate.matchScore}%
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">Опыт: {candidate.experience}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      <Link href={`/jobs/1`} className="hover:text-blue-600 transition-colors flex items-center gap-1">
                        {candidate.job}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs">{candidate.appliedAt}</td>
                    <td className="px-5 py-3">
                      {candidate.status === 'new' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-blue-100 text-blue-700 border-blue-200 whitespace-nowrap">Новый</span>}
                      {candidate.status === 'review' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-amber-100 text-amber-700 border-amber-200 whitespace-nowrap">На рассмотрении</span>}
                      {candidate.status === 'interview' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-emerald-100 text-emerald-700 border-emerald-200 whitespace-nowrap">Приглашен</span>}
                      {candidate.status === 'rejected' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-slate-100 text-slate-700 border-slate-200 whitespace-nowrap">Отказ</span>}
                    </td>
                    <td className="px-5 py-3 text-right relative">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors" title="Скачать резюме">
                          <Download className="w-4 h-4" />
                        </button>
                        <Link href="/dashboard/employer/messages" className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors" title="Написать сообщение">
                          <Mail className="w-4 h-4" />
                        </Link>
                        {candidate.status !== 'interview' && (
                          <button 
                            onClick={() => handleStatusChange(candidate.id, 'interview')}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded hover:bg-emerald-50 transition-colors" 
                            title="Пригласить"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {candidate.status !== 'rejected' && (
                          <button 
                            onClick={() => handleStatusChange(candidate.id, 'rejected')}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors" 
                            title="Отказать"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {/* Mobile Actions Dropdown */}
                      <button 
                        onClick={() => toggleDropdown(candidate.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors md:hidden absolute right-5 top-1/2 -translate-y-1/2"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {openDropdownId === candidate.id && (
                        <div 
                          ref={dropdownRef}
                          className="md:hidden absolute right-5 top-10 w-max min-w-[12rem] bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1 text-left"
                        >
                          <button className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap">
                            <Download className="w-4 h-4 text-slate-400" />
                            Скачать резюме
                          </button>
                          <Link href="/dashboard/employer/messages" className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap">
                            <Mail className="w-4 h-4 text-slate-400" />
                            Написать сообщение
                          </Link>
                          {candidate.status !== 'interview' && (
                            <button 
                              onClick={() => handleStatusChange(candidate.id, 'interview')}
                              className="w-full px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 whitespace-nowrap"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              Пригласить
                            </button>
                          )}
                          {candidate.status !== 'rejected' && (
                            <button 
                              onClick={() => handleStatusChange(candidate.id, 'rejected')}
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
