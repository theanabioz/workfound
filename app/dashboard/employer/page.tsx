import { Briefcase, Users, Eye, Plus, ChevronRight, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function EmployerDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Панель управления</h1>
          <p className="text-sm text-slate-500 mt-1">TransLogistics GmbH • ID: 49201</p>
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
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">3</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Briefcase className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-emerald-600 font-medium flex items-center"><ArrowUpRight className="w-3 h-3 mr-0.5"/> 1</span>
            <span className="text-slate-400 ml-1.5">за текущий месяц</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Новые отклики</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">12</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Users className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-emerald-600 font-medium flex items-center"><ArrowUpRight className="w-3 h-3 mr-0.5"/> 4</span>
            <span className="text-slate-400 ml-1.5">со вчерашнего дня</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Просмотры вакансий</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">145</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Eye className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-rose-600 font-medium flex items-center"><ArrowDownRight className="w-3 h-3 mr-0.5"/> 12%</span>
            <span className="text-slate-400 ml-1.5">по сравнению с прошлой неделей</span>
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
              {[
                { name: 'Алексей Смирнов', job: 'Водитель-дальнобойщик категории CE', date: '15 Мар 2026, 10:30', status: 'Новый', statusColor: 'bg-blue-100 text-blue-700 border-blue-200' },
                { name: 'Иван Петров', job: 'Сварщик MIG/MAG', date: '14 Мар 2026, 15:45', status: 'На рассмотрении', statusColor: 'bg-slate-100 text-slate-700 border-slate-200' },
                { name: 'Сергей Иванов', job: 'Водитель-дальнобойщик категории CE', date: '10 Мар 2026, 09:15', status: 'Приглашен', statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
              ].map((app, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-900">{app.name}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{app.job}</td>
                  <td className="px-5 py-3 text-slate-500 font-mono text-xs">{app.date}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium border whitespace-nowrap ${app.statusColor}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
