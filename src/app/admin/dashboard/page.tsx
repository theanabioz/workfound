import { getAdminStats } from '@/lib/supabase-service';
import { Users, Briefcase, FileText, Building2 } from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Обзор системы</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Пользователи" value={stats.users} icon={Users} color="bg-blue-50 text-blue-600" />
        <StatCard title="Компании" value={stats.companies} icon={Building2} color="bg-purple-50 text-purple-600" />
        <StatCard title="Вакансии" value={stats.jobs} icon={Briefcase} color="bg-green-50 text-green-600" />
        <StatCard title="Отклики" value={stats.applications} icon={FileText} color="bg-orange-50 text-orange-600" />
      </div>

      {/* Charts Placeholder */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm h-80 flex flex-col items-center justify-center text-gray-400">
          <span className="text-sm font-medium uppercase tracking-widest mb-2">Регистрации</span>
          <div className="w-full h-2 bg-gray-100 rounded-full max-w-[200px]" />
        </div>
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm h-80 flex flex-col items-center justify-center text-gray-400">
          <span className="text-sm font-medium uppercase tracking-widest mb-2">Активность</span>
          <div className="w-full h-2 bg-gray-100 rounded-full max-w-[200px]" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}