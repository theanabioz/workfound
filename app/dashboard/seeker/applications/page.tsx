import { Building2, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, MoreHorizontal, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationsPage() {
  const applications = [
    {
      id: 1,
      jobTitle: 'Водитель-дальнобойщик категории CE',
      company: 'TransLogistics GmbH',
      location: 'Германия, Мюнхен',
      salary: '€2,500 - €3,000',
      appliedDate: '12 Мар 2026',
      status: 'review', // review, accepted, rejected, sent
    },
    {
      id: 2,
      jobTitle: 'Строитель-универсал',
      company: 'BuildEuro Sp. z o.o.',
      location: 'Польша, Варшава',
      salary: 'от €1,800',
      appliedDate: '10 Мар 2026',
      status: 'accepted',
    },
    {
      id: 3,
      jobTitle: 'Сварщик MIG/MAG',
      company: 'MetalWorks s.r.o.',
      location: 'Чехия, Прага',
      salary: '€2,000 - €2,400',
      appliedDate: '08 Мар 2026',
      status: 'sent',
    },
    {
      id: 4,
      jobTitle: 'Монтажник солнечных панелей',
      company: 'EcoEnergy B.V.',
      location: 'Нидерланды, Амстердам',
      salary: '€2,200 - €2,800',
      appliedDate: '01 Мар 2026',
      status: 'rejected',
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-emerald-100 text-emerald-700 border-emerald-200">Приглашение</span>;
      case 'review':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-blue-100 text-blue-700 border-blue-200">Просмотрено</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-red-100 text-red-700 border-red-200">Отказ</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border bg-slate-100 text-slate-700 border-slate-200">Отправлено</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Мои отклики</h1>
          <p className="text-sm text-slate-500 mt-1">История откликов на вакансии</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-3">
                    <Link href={`/jobs/${app.id}`} className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      {app.jobTitle}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <div className="text-xs text-slate-500 mt-0.5">{app.location} • {app.salary}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {app.company}
                  </td>
                  <td className="px-5 py-3 text-slate-500 font-mono text-xs">{app.appliedDate}</td>
                  <td className="px-5 py-3">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {app.status === 'accepted' ? (
                      <Link href="/dashboard/seeker/messages" className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors inline-block">
                        Чат
                      </Link>
                    ) : (
                      <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    )}
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
