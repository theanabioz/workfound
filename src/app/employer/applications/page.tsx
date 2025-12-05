import Link from 'next/link';
import { getCurrentUser, getEmployerApplications } from '@/lib/supabase-service';
import { ArrowLeft } from 'lucide-react';
import { KanbanBoard } from '@/components/KanbanBoard';

export default async function ApplicationsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'employer') {
    return <div className="p-8">Доступ запрещен.</div>;
  }

  const applications = await getEmployerApplications(currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50 p-8 overflow-hidden"> 
      <div className="h-full flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 flex-shrink-0">
          <Link href="/employer/dashboard" className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Отклики кандидатов</h1>
            <p className="text-gray-500 text-sm">Перетаскивайте карточки, чтобы менять статус</p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
           <KanbanBoard initialApplications={applications} />
        </div>
      </div>
    </div>
  );
}