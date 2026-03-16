import Link from 'next/link';
import { MapPin, Banknote, Clock, Star, ChevronRight, Building2 } from 'lucide-react';

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
    <div className={`group bg-white border-b transition-all duration-200 hover:bg-zinc-50 p-5 sm:p-7 ${isPremium ? 'border-l-4 border-l-zinc-900' : 'border-l-4 border-l-transparent'}`}>
      <div className="flex flex-col gap-4">
        
        {/* Header: Title & Salary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            {isPremium && (
              <div className="flex items-center gap-1.5 text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                <Star className="w-3 h-3 fill-current" />
                Premium
              </div>
            )}
            <Link href={`/jobs/${id}`} className="block group/title">
              <h3 className="text-xl font-bold text-zinc-900 group-hover/title:text-zinc-600 transition-colors leading-tight mb-1">
                {title}
              </h3>
            </Link>
            
            {/* Meta: Company, Location, Date */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-zinc-400" />
                {company}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400" />
                {location}
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Clock className="w-4 h-4 text-zinc-400" />
                {postedAt}
              </div>
            </div>
          </div>

          {/* Salary - Desktop/Tablet prominent placement */}
          <div className="shrink-0 text-left sm:text-right">
            <div className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              {salary}
            </div>
          </div>
        </div>

        {/* Body: Description Snippet */}
        {description && (
          <div className="max-w-3xl">
            <p className="text-zinc-600 text-sm sm:text-base line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Footer: Tags & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-2">
          {/* Benefits Tags - Neater display */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border border-zinc-200/50 flex items-center gap-1.5"
              >
                <div className="w-1 h-1 bg-zinc-400 rounded-full" />
                {tag}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <Link 
            href={`/jobs/${id}`} 
            className="inline-flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all group/btn"
          >
            Подробнее
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
