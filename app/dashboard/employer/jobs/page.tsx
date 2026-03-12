import Link from 'next/link';
import { Plus, MoreVertical, Eye, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EmployerJobsPage() {
  const jobs = [
    {
      id: 1,
      title: 'Водитель-дальнобойщик категории CE',
      status: 'active',
      views: 145,
      applications: 12,
      postedAt: '10 Марта 2026',
    },
    {
      id: 2,
      title: 'Сварщик MIG/MAG',
      status: 'active',
      views: 89,
      applications: 5,
      postedAt: '8 Марта 2026',
    },
    {
      id: 3,
      title: 'Монтажник строительных лесов',
      status: 'draft',
      views: 0,
      applications: 0,
      postedAt: 'Черновик',
    },
    {
      id: 4,
      title: 'Разнорабочий на склад',
      status: 'closed',
      views: 320,
      applications: 45,
      postedAt: '1 Февраля 2026',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Мои вакансии</h1>
          <p className="text-slate-500 mt-1 font-medium">Управление размещенными вакансиями</p>
        </div>
        <Link href="/post-job" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Разместить вакансию
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/75 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <div key={job.id} className="p-6 sm:p-8 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Link href={`/jobs/${job.id}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    {job.title}
                  </Link>
                  {job.status === 'active' && <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Активна</span>}
                  {job.status === 'draft' && <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Черновик</span>}
                  {job.status === 'closed' && <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Закрыта</span>}
                </div>
                
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {job.postedAt}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-slate-400" />
                    {job.views} просмотров
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-blue-600">
                    <Users className="w-4 h-4" />
                    {job.applications} откликов
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <Link href={`/dashboard/employer/applications?jobId=${job.id}`} className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-semibold text-sm transition-colors">
                  Смотреть отклики
                </Link>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
