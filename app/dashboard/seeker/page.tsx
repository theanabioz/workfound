import { FileText, Send, Bookmark, ChevronRight, CheckCircle2, AlertCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function SeekerDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Личный кабинет</h1>
          <p className="text-sm text-slate-500 mt-1">Алексей Смирнов • ID: 84729</p>
        </div>
        <Link href="/" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
          Поиск вакансий
        </Link>
      </div>

      {/* Profile Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Профиль заполнен на 80%</h3>
            <p className="text-xs text-blue-700 mt-1">Добавьте информацию о знании языков для повышения видимости резюме.</p>
          </div>
        </div>
        <Link href="/dashboard/seeker/resume" className="shrink-0 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-md text-xs font-medium transition-colors">
          Обновить резюме
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Мои отклики</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">5</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Send className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Приглашения</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">1</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Сохраненные</p>
              <h3 className="text-2xl font-semibold text-slate-900 mt-1 font-mono tracking-tight">3</h3>
            </div>
            <div className="p-2 bg-slate-50 rounded-md border border-slate-100">
              <Bookmark className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-semibold text-slate-800 text-sm">История откликов</h2>
          <Link href="/dashboard/seeker/applications" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center">
            Все отклики <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-medium">Компания</th>
                <th className="px-5 py-3 font-medium">Вакансия</th>
                <th className="px-5 py-3 font-medium">Дата</th>
                <th className="px-5 py-3 font-medium">Статус</th>
                <th className="px-5 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                { company: 'TransLogistics GmbH', job: 'Водитель-дальнобойщик категории CE', date: '15 Мар 2026', status: 'Просмотрено', statusColor: 'bg-blue-100 text-blue-700 border-blue-200' },
                { company: 'BuildEuro Sp. z o.o.', job: 'Строитель-универсал', date: '14 Мар 2026', status: 'Приглашение', statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                { company: 'MetalWorks s.r.o.', job: 'Сварщик MIG/MAG', date: '10 Мар 2026', status: 'Отправлено', statusColor: 'bg-slate-100 text-slate-700 border-slate-200' },
              ].map((app, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-900">{app.company}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{app.job}</td>
                  <td className="px-5 py-3 text-slate-500 font-mono text-xs">{app.date}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${app.statusColor}`}>
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
