'use client';

import { useState } from 'react';
import { Application, Resume } from '@/types';
import { updateApplicationStatus } from '@/lib/supabase-service';
import { ChevronDown, ChevronRight, User, ExternalLink, Check, X, MessageSquare, Calendar } from 'lucide-react';

type AppWithDetails = Application & { jobTitle: string; resume?: Resume & { fullName?: string } };

export function EmployerKanban({ initialApplications }: { initialApplications: AppWithDetails[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Группировка
  const groups = {
    new: applications.filter(a => a.status === 'new'),
    viewed: applications.filter(a => a.status === 'viewed'),
    interview: applications.filter(a => a.status === 'interview'),
    offer: applications.filter(a => a.status === 'offer'),
    rejected: applications.filter(a => a.status === 'rejected'),
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    setLoadingId(appId);
    
    // Optimistic Update (сразу меняем в UI)
    const oldApps = [...applications];
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus as any } : app
    ));

    try {
      await updateApplicationStatus(appId, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert on error
      setApplications(oldApps);
      alert('Ошибка обновления статуса');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. НОВЫЕ (Самое важное) */}
      <KanbanSection 
        title="Новые отклики" 
        count={groups.new.length} 
        color="blue" 
        defaultOpen={true}
      >
        {groups.new.length === 0 && <EmptyState text="Нет новых заявок" />}
        {groups.new.map(app => (
          <KanbanCard 
            key={app.id} 
            app={app} 
            loading={loadingId === app.id}
            onAction={(status) => handleStatusChange(app.id, status)}
            actions={[
              { label: 'В работу', status: 'viewed', icon: Check, color: 'bg-blue-600 text-white hover:bg-blue-700' },
              { label: 'Отклонить', status: 'rejected', icon: X, color: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' }
            ]}
          />
        ))}
      </KanbanSection>

      {/* 2. В РАБОТЕ (Просмотренные) */}
      <KanbanSection 
        title="На рассмотрении" 
        count={groups.viewed.length} 
        color="indigo"
        defaultOpen={true}
      >
        {groups.viewed.length === 0 && <EmptyState text="Пусто" />}
        {groups.viewed.map(app => (
          <KanbanCard 
            key={app.id} 
            app={app} 
            loading={loadingId === app.id}
            onAction={(status) => handleStatusChange(app.id, status)}
            actions={[
              { label: 'Интервью', status: 'interview', icon: Calendar, color: 'bg-indigo-600 text-white hover:bg-indigo-700' },
              { label: 'Отказ', status: 'rejected', icon: X, color: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' }
            ]}
          />
        ))}
      </KanbanSection>

      {/* 3. ИНТЕРВЬЮ */}
      <KanbanSection 
        title="Интервью" 
        count={groups.interview.length} 
        color="purple"
        defaultOpen={true}
      >
        {groups.interview.map(app => (
          <KanbanCard 
            key={app.id} 
            app={app} 
            loading={loadingId === app.id}
            onAction={(status) => handleStatusChange(app.id, status)}
            actions={[
              { label: 'Оффер', status: 'offer', icon: Check, color: 'bg-green-600 text-white hover:bg-green-700' },
              { label: 'Отказ', status: 'rejected', icon: X, color: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' }
            ]}
          />
        ))}
      </KanbanSection>

      {/* 4. ОФФЕРЫ */}
      {groups.offer.length > 0 && (
        <KanbanSection title="Оффер выставлен" count={groups.offer.length} color="green" defaultOpen={false}>
          {groups.offer.map(app => (
            <KanbanCard 
              key={app.id} 
              app={app} 
              loading={loadingId === app.id}
              onAction={(status) => handleStatusChange(app.id, status)}
              actions={[]} // Финальная стадия
            />
          ))}
        </KanbanSection>
      )}

      {/* 5. ОТКАЗЫ */}
      <KanbanSection title="Архив / Отказы" count={groups.rejected.length} color="gray" defaultOpen={false}>
        {groups.rejected.map(app => (
          <KanbanCard 
            key={app.id} 
            app={app} 
            loading={loadingId === app.id}
            onAction={(status) => handleStatusChange(app.id, status)}
            actions={[
              { label: 'Вернуть', status: 'new', icon: Check, color: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' }
            ]}
          />
        ))}
      </KanbanSection>

    </div>
  );
}

// --- Sub-Components ---

function KanbanSection({ title, count, children, color, defaultOpen }: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  const style = colors[color as keyof typeof colors] || colors.gray;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
          <h3 className="font-bold text-gray-900">{title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${style}`}>
            {count}
          </span>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 space-y-4 bg-gray-50/30 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}

function KanbanCard({ app, actions, onAction, loading }: { app: AppWithDetails, actions: any[], onAction: (s: string) => void, loading: boolean }) {
  return (
    <div className={`bg-white p-5 rounded-lg border border-gray-200 shadow-sm transition-all ${loading ? 'opacity-50 pointer-events-none' : 'hover:border-blue-300'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">
            {app.resume ? app.resume.fullName || 'Кандидат' : 'Кандидат'}
          </h4>
          <p className="text-sm text-gray-500">Вакансия: <span className="font-medium text-gray-700">{app.jobTitle}</span></p>
        </div>
        
        {app.resumeUrl && (
          <a href={app.resumeUrl} target="_blank" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            Резюме
          </a>
        )}
      </div>

      {/* Resume Details */}
      {app.resume && (
        <div className="mb-4 text-sm text-gray-700 bg-gray-50 p-3 rounded">
          <div className="font-medium mb-1">{app.resume.title}</div>
          <div className="line-clamp-2 text-gray-600">{app.resume.about}</div>
        </div>
      )}

      {app.coverLetter && (
        <div className="text-sm italic text-gray-600 mb-4 border-l-2 border-blue-200 pl-3">
          "{app.coverLetter}"
        </div>
      )}

      {/* Actions Toolbar */}
      {actions.length > 0 && (
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          {actions.map((action: any) => {
            const Icon = action.icon;
            return (
              <button
                key={action.status}
                onClick={() => onAction(action.status)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${action.color}`}
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="text-center py-8 text-gray-400 italic">{text}</div>;
}
