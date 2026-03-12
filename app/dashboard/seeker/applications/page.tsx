import { Building2, MapPin, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationsPage() {
  const applications = [
    {
      id: 1,
      jobTitle: 'Водитель-дальнобойщик категории CE',
      company: 'TransLogistics GmbH',
      location: 'Германия, Мюнхен',
      salary: '€2,500 - €3,000',
      appliedDate: '12 Марта 2026',
      status: 'review', // review, accepted, rejected, sent
    },
    {
      id: 2,
      jobTitle: 'Строитель-универсал',
      company: 'BuildEuro Sp. z o.o.',
      location: 'Польша, Варшава',
      salary: 'от €1,800',
      appliedDate: '10 Марта 2026',
      status: 'accepted',
    },
    {
      id: 3,
      jobTitle: 'Сварщик MIG/MAG',
      company: 'MetalWorks s.r.o.',
      location: 'Чехия, Прага',
      salary: '€2,000 - €2,400',
      appliedDate: '8 Марта 2026',
      status: 'sent',
    },
    {
      id: 4,
      jobTitle: 'Монтажник солнечных панелей',
      company: 'EcoEnergy B.V.',
      location: 'Нидерланды, Амстердам',
      salary: '€2,200 - €2,800',
      appliedDate: '1 Марта 2026',
      status: 'rejected',
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider"><CheckCircle2 className="w-4 h-4" /> Приглашение</span>;
      case 'review':
        return <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider"><AlertCircle className="w-4 h-4" /> Просмотрено</span>;
      case 'rejected':
        return <span className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider"><XCircle className="w-4 h-4" /> Отказ</span>;
      default:
        return <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider"><Clock className="w-4 h-4" /> Отправлено</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Мои отклики</h1>
        <p className="text-slate-500 mt-1 font-medium">История ваших откликов на вакансии</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/75 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {applications.map((app) => (
            <div key={app.id} className="p-6 sm:p-8 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <Link href={`/jobs/${app.id}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors block mb-2">
                  {app.jobTitle}
                </Link>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {app.company}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {app.location}
                  </div>
                  <div className="font-semibold text-emerald-700">
                    {app.salary}
                  </div>
                </div>
                <div className="text-sm text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Отправлено: {app.appliedDate}
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                {getStatusBadge(app.status)}
                
                {app.status === 'accepted' && (
                  <Link href="/dashboard/seeker/messages" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-600/20">
                    Написать работодателю
                  </Link>
                )}
                {app.status === 'review' && (
                  <span className="text-sm text-slate-500 font-medium">Работодатель изучает резюме</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
