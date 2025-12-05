'use client';

import { useState, useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  useDraggable, 
  useDroppable, 
  DragStartEvent, 
  DragEndEvent,
  DragOverEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { Application, Resume } from '@/types';
import { updateApplicationStatus } from '@/lib/supabase-service';
import { ExternalLink, MoreHorizontal, ChevronDown, ChevronRight, GripVertical, Filter, Briefcase } from 'lucide-react';
import { ApplicationModal } from './ApplicationModal';

type AppWithDetails = Application & { jobTitle: string; resume?: Resume };

const SECTIONS = [
  { id: 'new', title: 'Новые отклики', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'viewed', title: 'На рассмотрении', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
  { id: 'interview', title: 'Интервью', color: 'bg-purple-50 border-purple-200 text-purple-800' },
  { id: 'offer', title: 'Оффер выставлен', color: 'bg-green-50 border-green-200 text-green-800' },
  { id: 'rejected', title: 'Архив / Отказ', color: 'bg-gray-50 border-gray-200 text-gray-800' },
];

export function KanbanBoard({ initialApplications }: { initialApplications: AppWithDetails[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppWithDetails | null>(null);
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    new: true,
    viewed: true,
    interview: true,
    offer: false,
    rejected: false
  });
  const [selectedJobId, setSelectedJobId] = useState<string>('all');

  // --- Filter Logic ---
  const uniqueJobs = useMemo(() => {
    const jobs = new Map();
    initialApplications.forEach(app => {
      if (!jobs.has(app.jobId)) {
        jobs.set(app.jobId, app.jobTitle);
      }
    });
    return Array.from(jobs.entries()).map(([id, title]) => ({ id, title }));
  }, [initialApplications]);

  const filteredApplications = useMemo(() => {
    if (selectedJobId === 'all') return applications;
    return applications.filter(app => app.jobId === selectedJobId);
  }, [applications, selectedJobId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    let newStatus = over.id as string;
    const overApp = applications.find(a => a.id === over.id);
    if (overApp) {
        newStatus = overApp.status;
    }

    if (!SECTIONS.find(s => s.id === newStatus)) return;

    const appId = active.id as string;
    const app = applications.find(a => a.id === appId);
    
    if (!app || app.status === newStatus) return;

    // Optimistic Update
    const oldApps = [...applications];
    setApplications(prev => prev.map(a => 
      a.id === appId ? { ...a, status: newStatus as any } : a
    ));
    
    if (!openSections[newStatus]) {
        toggleSection(newStatus);
    }

    try {
      await updateApplicationStatus(appId, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      setApplications(oldApps);
      alert('Ошибка сохранения статуса');
    }
  };

  const activeApp = applications.find(a => a.id === activeId);

  return (
    <div className="max-w-3xl mx-auto pb-20 space-y-4">
      
      {/* --- FILTER BAR --- */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-6 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Фильтр:</span>
        </div>
        
        <div className="relative w-full max-w-xs">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 pr-8 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="all">Все вакансии ({applications.length})</option>
            {uniqueJobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* --- BOARD --- */}
      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        {SECTIONS.map(section => (
          <DroppableSection 
            key={section.id} 
            section={section}
            apps={filteredApplications.filter(a => a.status === section.id)}
            isOpen={openSections[section.id]}
            onToggle={() => toggleSection(section.id)}
            onCardClick={(app: AppWithDetails) => setSelectedApp(app)}
          />
        ))}

        <DragOverlay>
          {activeApp ? (
            <div className="opacity-90 rotate-2 scale-105 cursor-grabbing">
               <Card app={activeApp} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* MODAL */}
      {selectedApp && (
        <ApplicationModal 
          app={selectedApp} 
          onClose={() => setSelectedApp(null)} 
        />
      )}
    </div>
  );
}

// --- Sub-components ---

function DroppableSection({ section, apps, isOpen, onToggle, onCardClick }: any) {
  const { setNodeRef, isOver } = useDroppable({
    id: section.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`rounded-xl border transition-colors ${
        isOver ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div 
        onClick={onToggle}
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
          <h3 className="font-bold text-gray-900">{section.title}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${section.color.replace('text-', 'bg-').replace('border-', 'bg-opacity-20 ')}`}>
            {apps.length}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {apps.length === 0 ? (
            <div className="col-span-full py-4 text-center text-sm text-gray-400 italic border-2 border-dashed border-gray-100 rounded-lg">
              Перетащите сюда карточку
            </div>
          ) : (
            apps.map((app: any) => (
              <DraggableCard key={app.id} app={app} onClick={() => onCardClick(app)} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function DraggableCard({ app, onClick }: { app: AppWithDetails, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={`touch-none ${isDragging ? 'opacity-30' : ''}`}
      onClick={onClick}
    >
      <Card app={app} />
    </div>
  );
}

function Card({ app, isOverlay }: { app: AppWithDetails, isOverlay?: boolean }) {
  return (
    <div className={`bg-white p-2 rounded-lg border border-gray-200 shadow-sm group flex flex-col relative h-full transition-all duration-200 ease-out ${
      isOverlay 
        ? 'shadow-xl border-blue-500 scale-105 z-50 cursor-grabbing' 
        : 'hover:border-blue-300 hover:shadow-xl hover:scale-110 hover:z-50 hover:-translate-y-1 cursor-grab'
    }`}>
      
      {/* Top Actions */}
      <div className="flex justify-between items-start absolute top-1.5 left-1.5 right-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-gray-400 hover:text-gray-600 p-0.5 rounded hover:bg-gray-50 bg-white/80 backdrop-blur-sm shadow-sm">
          <GripVertical className="w-3 h-3" />
        </div>
        {app.resumeUrl && (
          <a href={app.resumeUrl} target="_blank" className="text-blue-400 hover:text-blue-600 p-0.5 rounded hover:bg-blue-50 bg-white/80 backdrop-blur-sm shadow-sm" title="Резюме">
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center pt-3 pb-1">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mb-1.5 shadow-sm group-hover:scale-110 transition-transform">
          {app.resume?.fullName?.charAt(0).toUpperCase() || '?'}
        </div>

        <h4 className="font-bold text-gray-900 text-center text-xs line-clamp-1 w-full px-1 group-hover:text-blue-600 transition-colors">
          {app.resume ? app.resume.fullName || 'Кандидат' : 'Кандидат'}
        </h4>
        <div className="text-[10px] text-gray-400 text-center line-clamp-1 w-full px-1 mt-0.5">
          {app.jobTitle}
        </div>

        {app.resume && (
          <div className="flex flex-wrap gap-1 justify-center mt-2 opacity-80 items-center group-hover:opacity-100">
            {app.resume.skills.split(',').slice(0, 1).map((skill, i) => (
              <span key={i} className="text-[9px] bg-gray-50 px-1.5 py-0.5 rounded-sm text-gray-500 border border-gray-100 leading-none">
                {skill.trim()}
              </span>
            ))}
             {app.resume.skills.split(',').length > 1 && (
                <span className="text-[9px] text-gray-400">+{app.resume.skills.split(',').length - 1}</span>
             )}
          </div>
        )}
      </div>
    </div>
  );
}