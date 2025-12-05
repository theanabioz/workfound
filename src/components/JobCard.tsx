import Link from 'next/link';
import { Job } from '@/types';
import { MapPin, Banknote, Clock, Building2 } from 'lucide-react';
import { SaveButton } from './SaveButton';

export function JobCard({ job, isSaved }: { job: Job; isSaved?: boolean }) {
  const isDirectHiring = job.applicationMethod !== 'internal_ats';
  
  // Генерируем цвет для логотипа на основе ID (чтобы был постоянным)
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-indigo-500'];
  const colorIndex = parseInt(job.id.replace(/\D/g, '') || '0') % colors.length;
  const bgClass = colors[colorIndex];

  return (
    <Link 
      href={`/jobs/${job.id}`}
      className="group block bg-white rounded-xl border border-gray-200 p-5 hover:border-black hover:shadow-md transition-all relative"
    >
      {/* Save Button Positioned Absolutely */}
      <div className="absolute top-4 right-4 z-10">
        <SaveButton itemId={job.id} itemType="job" initialSaved={isSaved} />
      </div>

      <div className="flex items-start gap-4">
        
        {/* Logo Placeholder */}
        <div className={`w-12 h-12 rounded-lg ${bgClass} flex items-center justify-center text-white font-bold text-xl shrink-0`}>
          {job.title.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Building2 className="w-3 h-3" />
                Компания №{job.employerId}
              </p>
            </div>
            
            {isDirectHiring ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                Прямой контакт
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                Отклик на сайте
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
              <Banknote className="w-3.5 h-3.5 text-gray-400" />
              {job.salaryRange}
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
