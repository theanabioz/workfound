import Link from 'next/link';
import { Job } from '@/types';
import { MapPin, Building2, Clock, CheckCircle2, Phone, Euro } from 'lucide-react';
import { SaveButton } from './SaveButton';

export function JobCard({ job, isSaved }: { job: Job; isSaved?: boolean }) {
  const isDirectHiring = job.applicationMethod !== 'internal_ats';
  
  // Логотип (цветная заглушка)
  const colors = [
    'bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-orange-600', 'bg-indigo-600', 'bg-pink-600'
  ];
  const colorIndex = parseInt(job.id.replace(/\D/g, '') || '0') % colors.length;
  const bgClass = colors[colorIndex];

  // Дата
  const date = new Date(job.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const timeAgo = diffDays === 1 ? 'Сегодня' : diffDays === 2 ? 'Вчера' : `${diffDays} д. назад`;

  const isPromoted = job.promotedUntil && new Date(job.promotedUntil) > new Date();

  return (
    <Link 
      href={`/jobs/${job.id}`}
      className={`group relative flex flex-col sm:flex-row gap-5 p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:border-black/20 hover:shadow-xl hover:-translate-y-0.5 ${
        isPromoted
          ? 'bg-purple-50/50 border-2 border-purple-400 shadow-md'
          : job.isHighlighted 
            ? 'bg-yellow-50/50 border-2 border-yellow-400 shadow-sm' 
            : 'bg-white border border-gray-200'
      }`}
    >
      {/* Promoted Badge */}
      {isPromoted && (
        <div className="absolute -top-3 left-4 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
          TOP
        </div>
      )}

      {/* Save Button (Absolute Top Right) */}
      <div className="absolute top-4 right-4 z-10">
        <SaveButton itemId={job.id} itemType="job" initialSaved={isSaved} />
      </div>

      {/* Logo */}
      <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-sm ${bgClass}`}>
        {job.title.charAt(0)}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        
        {/* Top Row: Title + Salary */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 pr-8">
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
              {job.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Компания #{job.employerId.slice(0, 4)}
            </p>
          </div>

          {/* Salary (Right on Desktop, Below on Mobile) */}
          <div className="mt-2 sm:mt-0 text-right sm:text-right">
            <span className="inline-flex items-center gap-1 font-bold text-gray-900 text-base sm:text-lg bg-green-50 text-green-700 px-2 py-0.5 rounded-md w-fit sm:ml-auto border border-green-100">
              <Euro className="w-4 h-4" />
              {job.salaryRange}
              <span className="text-xs font-normal opacity-80">
                {job.salaryPeriod === 'hour' ? '/ч' : job.salaryPeriod === 'year' ? '/год' : '/мес'}
              </span>
            </span>
          </div>
        </div>

        {/* Bottom Row: Tags & Mobile Meta */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Location (New Position) */}
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400" />
              {job.location}
            </span>

            <div className="h-1 w-1 rounded-full bg-gray-300 hidden sm:block"></div>

            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${isDirectHiring ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
              {isDirectHiring ? <Phone className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
              {isDirectHiring ? 'Прямой контакт' : 'Отклик на сайте'}
            </span>
            
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500 border border-gray-100">
              <Clock className="w-3 h-3" /> Полный день
            </span>
          </div>

          {/* Date */}
          <div className="text-xs text-gray-400 font-medium whitespace-nowrap">
            {timeAgo}
          </div>
        </div>

      </div>
    </Link>
  );
}
