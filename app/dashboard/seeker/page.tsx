import { FileText, Send, Bookmark, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SeekerDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Обзор</h1>
          <p className="text-slate-500 mt-1 font-medium">Добро пожаловать, Алексей Смирнов</p>
        </div>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 text-center">
          Найти работу
        </Link>
      </div>

      {/* Profile Completion */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/75 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 shrink-0 relative">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-500"
              strokeDasharray="80, 100"
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-extrabold text-slate-900 text-xl">
            80%
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Профиль заполнен на 80%</h3>
          <p className="text-slate-600 mb-5 text-lg">Добавьте информацию о знании языков, чтобы получать больше приглашений от работодателей.</p>
          <Link href="/dashboard/seeker/resume" className="text-blue-600 font-semibold hover:underline bg-blue-50 px-4 py-2 rounded-lg inline-block">
            Дополнить резюме
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/75 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
              <Send className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">5</div>
              <div className="text-sm text-slate-500 font-semibold mt-0.5">Моих откликов</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/75 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">1</div>
              <div className="text-sm text-slate-500 font-semibold mt-0.5">Приглашение</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200/75 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
              <Bookmark className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">3</div>
              <div className="text-sm text-slate-500 font-semibold mt-0.5">В избранном</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-3xl border border-slate-200/75 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 text-xl tracking-tight">Статус откликов</h2>
          <Link href="/dashboard/seeker/applications" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center transition-colors">
            Все отклики <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { company: 'TransLogistics GmbH', job: 'Водитель-дальнобойщик категории CE', date: 'Сегодня', status: 'Просмотрено', statusColor: 'bg-blue-50 text-blue-700' },
            { company: 'BuildEuro Sp. z o.o.', job: 'Строитель-универсал', date: 'Вчера', status: 'Приглашение', statusColor: 'bg-emerald-50 text-emerald-700' },
            { company: 'MetalWorks s.r.o.', job: 'Сварщик MIG/MAG', date: '10 Марта', status: 'Отправлено', statusColor: 'bg-slate-100 text-slate-600' },
          ].map((app, i) => (
            <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
              <div>
                <div className="font-bold text-slate-900 text-lg">{app.job}</div>
                <div className="text-sm text-slate-500 font-medium mt-0.5">{app.company}</div>
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
