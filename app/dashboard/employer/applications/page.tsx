import { Search, Filter, Mail, Download, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function EmployerApplicationsPage() {
  const candidates = [
    {
      id: 1,
      name: 'Алексей Смирнов',
      job: 'Водитель-дальнобойщик категории CE',
      experience: '5 лет',
      appliedAt: 'Сегодня, 10:30',
      status: 'new',
      matchScore: 95,
    },
    {
      id: 2,
      name: 'Иван Петров',
      job: 'Сварщик MIG/MAG',
      experience: '3 года',
      appliedAt: 'Вчера, 15:45',
      status: 'review',
      matchScore: 82,
    },
    {
      id: 3,
      name: 'Сергей Иванов',
      job: 'Водитель-дальнобойщик категории CE',
      experience: '8 лет',
      appliedAt: '10 Марта 2026',
      status: 'interview',
      matchScore: 98,
    },
    {
      id: 4,
      name: 'Дмитрий Волков',
      job: 'Разнорабочий на склад',
      experience: 'Без опыта',
      appliedAt: '9 Марта 2026',
      status: 'rejected',
      matchScore: 45,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Отклики кандидатов</h1>
          <p className="text-slate-500 mt-1 font-medium">Управление кандидатами на ваши вакансии</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/75 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Поиск по имени или должности..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700">
            <option>Все вакансии</option>
            <option>Водитель-дальнобойщик</option>
            <option>Сварщик MIG/MAG</option>
          </select>
          <button className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2 font-medium">
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Фильтры</span>
          </button>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-3xl border border-slate-200/75 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="p-6 sm:p-8 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6">
              <div className="flex items-start gap-5 flex-1">
                <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                  {candidate.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{candidate.name}</h3>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md">
                      {candidate.matchScore}% совпадение
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-900 mb-2">{candidate.job}</div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Опыт: {candidate.experience}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>Отклик: {candidate.appliedAt}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end justify-between gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                {candidate.status === 'new' && <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Новый</span>}
                {candidate.status === 'review' && <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">На рассмотрении</span>}
                {candidate.status === 'interview' && <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Приглашен</span>}
                {candidate.status === 'rejected' && <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Отказ</span>}
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 rounded-lg transition-all" title="Скачать резюме">
                    <Download className="w-5 h-5" />
                  </button>
                  <Link href="/dashboard/employer/messages" className="p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 rounded-lg transition-all" title="Написать сообщение">
                    <Mail className="w-5 h-5" />
                  </Link>
                  <button className="p-2 text-slate-400 hover:text-emerald-600 bg-white border border-slate-200 hover:border-emerald-200 rounded-lg transition-all" title="Пригласить">
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 rounded-lg transition-all" title="Отказать">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
