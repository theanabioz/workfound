import { Briefcase, Users, Eye, Plus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function EmployerDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Обзор</h1>
          <p className="text-slate-500 mt-1 font-medium">Добро пожаловать, TransLogistics GmbH</p>
        </div>
        <Link href="/post-job" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Разместить вакансию
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/75 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
              <Briefcase className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">3</div>
              <div className="text-sm text-slate-500 font-semibold mt-0.5">Активные вакансии</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/75 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
              <Users className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">12</div>
              <div className="text-sm text-slate-500 font-semibold mt-0.5">Новых откликов</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/75 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0">
              <Eye className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">145</div>
              <div className="text-sm text-slate-500 font-semibold mt-0.5">Просмотров за неделю</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-3xl border border-slate-200/75 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 text-xl tracking-tight">Последние отклики</h2>
          <Link href="/dashboard/employer/applications" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center transition-colors">
            Все отклики <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { name: 'Алексей Смирнов', job: 'Водитель-дальнобойщик категории CE', date: 'Сегодня, 10:30', status: 'Новый', statusColor: 'bg-blue-50 text-blue-700' },
            { name: 'Иван Петров', job: 'Сварщик MIG/MAG', date: 'Вчера, 15:45', status: 'На рассмотрении', statusColor: 'bg-amber-50 text-amber-700' },
            { name: 'Сергей Иванов', job: 'Водитель-дальнобойщик категории CE', date: '10 Марта', status: 'Приглашен', statusColor: 'bg-emerald-50 text-emerald-700' },
          ].map((app, i) => (
            <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                  {app.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg">{app.name}</div>
                  <div className="text-sm text-slate-500 font-medium">{app.job}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-sm text-slate-400 font-medium hidden sm:block">{app.date}</div>
                <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${app.statusColor}`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
