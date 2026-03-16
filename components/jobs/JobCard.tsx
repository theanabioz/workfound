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
    <div className={`group bg-white border-b transition-colors duration-200 hover:bg-zinc-50 p-6 ${isPremium ? 'border-l-4 border-l-zinc-800 border-b-zinc-200' : 'border-b-zinc-200 border-l-4 border-l-transparent'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          {isPremium && (
            <div className="flex items-center gap-1.5 text-zinc-900 text-[10px] font-bold uppercase tracking-widest mb-3">
              <Star className="w-3 h-3 fill-current" />
              Premium
            </div>
          )}
          <Link href={`/jobs/${id}`} className="block">
            <h3 className="text-lg font-semibold text-zinc-900 group-hover:underline decoration-2 underline-offset-4 mb-1">{title}</h3>
          </Link>
          <div className="text-zinc-500 text-sm mb-4">{company}</div>
          
          <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-zinc-700 mb-5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zinc-400" />
              {location}
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Banknote className="w-4 h-4 text-zinc-400" />
              {salary}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="border border-zinc-200 text-zinc-600 text-[11px] uppercase tracking-wider px-2.5 py-1 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="hidden sm:flex flex-col items-end justify-between h-full min-h-[120px]">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            {postedAt}
          </div>
          <Link href={`/jobs/${id}`} className="bg-zinc-900 text-white hover:bg-zinc-800 px-6 py-2 text-sm font-medium transition-colors mt-auto">
            Откликнуться
          </Link>
        </div>
      </div>
      
      {/* Mobile footer */}
      <div className="sm:hidden flex items-center justify-between mt-6 pt-4 border-t border-zinc-100">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          {postedAt}
        </div>
        <Link href={`/jobs/${id}`} className="bg-zinc-900 text-white hover:bg-zinc-800 px-5 py-2 text-sm font-medium transition-colors">
          Откликнуться
        </Link>
      </div>
    </div>
  );
}
