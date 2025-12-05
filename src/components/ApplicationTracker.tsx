'use client';

import { useState } from 'react';
import { Application, Job } from '@/types';
import { ChevronDown, ChevronRight, CheckCircle, Clock, Eye, MessageSquare, XCircle, MapPin, Building2 } from 'lucide-react';
import Link from 'next/link';

type AppWithJob = Application & { job: Job };

interface TrackerProps {
  applications: AppWithJob[];
}

export function ApplicationTracker({ applications }: TrackerProps) {
  // Группировка
  const groups = {
    offer: applications.filter(a => a.status === 'offer'),
    interview: applications.filter(a => a.status === 'interview'),
    viewed: applications.filter(a => a.status === 'viewed'),
    new: applications.filter(a => a.status === 'new'),
    rejected: applications.filter(a => a.status === 'rejected'),
  };

  return (
    <div className="space-y-4">
      {/* 1. Высокий приоритет (Офферы и Интервью) */}
      {(groups.offer.length > 0 || groups.interview.length > 0) && (
        <TrackerSection 
          title="Требуют внимания" 
          count={groups.offer.length + groups.interview.length}
          defaultOpen={true}
          color="green"
        >
          {groups.offer.map(app => <TrackerCard key={app.id} app={app} icon={CheckCircle} color="text-green-600" badge="Оффер" />)}
          {groups.interview.map(app => <TrackerCard key={app.id} app={app} icon={MessageSquare} color="text-purple-600" badge="Интервью" />)}
        </TrackerSection>
      )}

      {/* 2. В работе (Просмотренные) */}
      <TrackerSection 
        title="Просмотренные работодателем" 
        count={groups.viewed.length}
        defaultOpen={true}
        color="blue"
      >
        {groups.viewed.length === 0 && <EmptyState text="Пока нет просмотренных откликов" />}
        {groups.viewed.map(app => <TrackerCard key={app.id} app={app} icon={Eye} color="text-blue-600" badge="Просмотрено" />)}
      </TrackerSection>

      {/* 3. Отправленные (Новые) */}
      <TrackerSection 
        title="Отправленные (Ожидают)" 
        count={groups.new.length}
        defaultOpen={groups.new.length < 5} // Если много, сворачиваем
        color="gray"
      >
        {groups.new.length === 0 && <EmptyState text="Нет новых откликов" />}
        {groups.new.map(app => <TrackerCard key={app.id} app={app} icon={Clock} color="text-gray-500" badge="Отправлено" />)}
      </TrackerSection>

      {/* 4. Архив (Отказы) */}
      {groups.rejected.length > 0 && (
        <TrackerSection 
          title="Архив / Отказы" 
          count={groups.rejected.length}
          defaultOpen={false} // Всегда свернуто
          color="red"
        >
          {groups.rejected.map(app => <TrackerCard key={app.id} app={app} icon={XCircle} color="text-red-500" badge="Отказ" />)}
        </TrackerSection>
      )}
    </div>
  );
}

// --- Sub-components ---

function TrackerSection({ title, count, children, defaultOpen, color }: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colorStyles = {
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    gray: 'bg-gray-50 border-gray-200 text-gray-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };

  const headerClass = colorStyles[color as keyof typeof colorStyles] || colorStyles.gray;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${isOpen ? 'bg-white' : 'bg-gray-50/50 hover:bg-gray-50'}`}
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
          <span className="font-semibold text-gray-900">{title}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${headerClass}`}>
            {count}
          </span>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 pt-2 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function TrackerCard({ app, icon: Icon, color, badge }: { app: AppWithJob, icon: any, color: string, badge: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-black/20 hover:shadow-sm transition-all bg-white group">
      
      <div className="flex items-start gap-4">
        {/* Job Logo Placeholder */}
        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0">
          {app.job.title.charAt(0)}
        </div>
        
        <div>
          <Link href={`/jobs/${app.jobId}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            {app.job.title}
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              Работодатель #{app.job.employerId.slice(0,4)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {app.job.location}
            </span>
            <span className="text-gray-300">|</span>
            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-0 flex items-center gap-3">
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${color.replace('text', 'bg')}/10 ${color.replace('text', 'border')}/20 ${color}`}>
          <Icon className="w-3.5 h-3.5" />
          {badge}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-6 text-gray-400 text-sm italic border border-dashed border-gray-200 rounded-lg">
      {text}
    </div>
  );
}
