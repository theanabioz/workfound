import Link from 'next/link';
import { LayoutDashboard, Users, FileText, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { signout } from '@/app/auth/actions';
import { getCurrentUser } from '@/lib/supabase-service';
import { notFound, redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login'); // Или 404, как хочешь
  }

  if (user.role !== 'admin') {
    notFound(); // 404 для всех, кто не админ
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 text-white p-1 rounded-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Админ</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <AdminLink href="/admin/dashboard" icon={LayoutDashboard} label="Обзор" />
          <AdminLink href="/admin/users" icon={Users} label="Пользователи" />
          <AdminLink href="/admin/jobs" icon={FileText} label="Вакансии" />
          <AdminLink href="/admin/settings" icon={Settings} label="Настройки" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={async () => { 'use server'; await signout(); }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function AdminLink({ href, icon: Icon, label }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}