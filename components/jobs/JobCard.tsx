import Link from 'next/link';
import { MapPin, Banknote, Clock, Star } from 'lucide-react';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  postedAt: string;
  isPremium?: boolean;
}

export default function JobCard({ id, title, company, location, salary, tags, postedAt, isPremium }: JobCardProps) {
  return (
    <div className={`group bg-white rounded-2xl border p-5 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${isPremium ? 'border-blue-200 bg-gradient-to-b from-blue-50/50 to-white' : 'border-slate-200/75 hover:border-blue-200'}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {isPremium && (
            <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-current" />
              Премиум
            </div>
          )}
          <Link href={`/jobs/${id}`} className="block">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">{title}</h3>
          </Link>
          <div className="text-slate-600 font-medium mb-4">{company}</div>
          
          <div className="flex flex-wrap gap-y-2 gap-x-5 text-sm text-slate-600 mb-5">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {location}
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <Banknote className="w-4 h-4 text-emerald-600" />
              {salary}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span key={index} className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-lg font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="hidden sm:flex flex-col items-end justify-between h-full min-h-[130px]">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {postedAt}
          </div>
          <Link href={`/jobs/${id}`} className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all mt-auto">
            Откликнуться
          </Link>
        </div>
      </div>
      
      {/* Mobile footer */}
      <div className="sm:hidden flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5" />
          {postedAt}
        </div>
        <Link href={`/jobs/${id}`} className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
          Откликнуться
        </Link>
      </div>
    </div>
  );
}
