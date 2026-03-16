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
  description?: string;
}

export default function JobCard({ id, title, company, location, salary, tags, postedAt, isPremium, description }: JobCardProps) {
  return (
    <div className={`group bg-white border-b transition-all duration-200 hover:bg-zinc-50 p-6 ${isPremium ? 'border-l-4 border-l-zinc-900' : 'border-l-4 border-l-transparent'}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Section: Main Info */}
        <div className="lg:w-1/3 min-w-0">
          {isPremium && (
            <div className="flex items-center gap-1.5 text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
              <Star className="w-3 h-3 fill-current" />
              Premium
            </div>
          )}
          <Link href={`/jobs/${id}`} className="block">
            <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors mb-1 truncate">
              {title}
            </h3>
          </Link>
          <div className="text-zinc-500 text-sm font-medium mb-3">{company}</div>
          
          <div className="flex items-center gap-1.5 text-sm text-zinc-600">
            <MapPin className="w-4 h-4 text-zinc-400" />
            {location}
          </div>
        </div>

        {/* Center Section: Description Preview (Desktop Only) */}
        <div className="hidden lg:block lg:flex-1 min-w-0">
          <div className="h-full flex flex-col justify-center">
            {description && (
              <p className="text-zinc-600 text-sm line-clamp-3 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Salary & Action */}
        <div className="lg:w-1/4 flex flex-col lg:items-end justify-between gap-4">
          <div className="flex flex-col lg:items-end">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">
              <Clock className="w-3 h-3" />
              {postedAt}
            </div>
            <div className="text-xl font-black text-zinc-900 tracking-tight">
              {salary}
            </div>
          </div>
          
          <Link 
            href={`/jobs/${id}`} 
            className="hidden lg:block bg-zinc-900 text-white hover:bg-zinc-800 px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Подробнее
          </Link>
        </div>
      </div>

      {/* Mobile Description Preview */}
      {description && (
        <div className="lg:hidden mt-4">
          <p className="text-zinc-600 text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      )}

      {/* Bottom Section: Benefits Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-none border border-zinc-200/50"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Mobile Call to Action */}
      <div className="lg:hidden mt-6 pt-4 border-t border-zinc-100">
        <Link 
          href={`/jobs/${id}`} 
          className="block w-full text-center bg-zinc-900 text-white hover:bg-zinc-800 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}
