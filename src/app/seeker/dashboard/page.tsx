import Link from 'next/link';
import { getCurrentUser, getSeekerApplications } from '@/lib/supabase-service';
import { createClient } from '@/utils/supabase/server';
import { FileText, MapPin, Clock } from 'lucide-react';

export default async function SeekerDashboard() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser || currentUser.role !== 'seeker') {
    return <div className="p-8">Доступ запрещен. Войдите как соискатель.</div>;
  }

  // Получаем отклики через новую функцию
  const myApplications = await getSeekerApplications(currentUser.id);

  // Статистика
  const stats = {
    total: myApplications.length,
    viewed: myApplications.filter(a => a.status === 'viewed').length,
    interview: myApplications.filter(a => a.status === 'interview').length,
    rejected: myApplications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Моя карьера</h1>
            <p className="text-gray-500">Привет, {currentUser.fullName}</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/seeker/saved"
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              Избранное
            </Link>
            <Link 
              href="/seeker/resumes"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Мои резюме
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Всего откликов</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Просмотров</p>
            <p className="text-2xl font-bold text-blue-600">{stats.viewed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Приглашений</p>
            <p className="text-2xl font-bold text-green-600">{stats.interview}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
             <p className="text-xs text-gray-500 mb-1">Отказов</p>
             <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">История откликов</h2>
          </div>
          
          {myApplications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Вы пока не откликались на вакансии.
              <Link href="/" className="text-blue-600 hover:underline ml-1">Найти работу</Link>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Вакансия</th>
                  <th className="px-6 py-3 font-medium">Дата</th>
                  <th className="px-6 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myApplications.map((app: any) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/jobs/${app.jobId}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {app.job.title}
                      </Link>
                      <div className="text-xs text-gray-400 mt-1">{app.job.location}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    new: 'bg-gray-100 text-gray-700',
    viewed: 'bg-blue-50 text-blue-700',
    interview: 'bg-purple-100 text-purple-700',
    offer: 'bg-green-100 text-green-700',
    rejected: 'bg-red-50 text-red-700',
  };
  
  const labels = {
    new: 'Отправлено',
    viewed: 'Просмотрено',
    interview: 'Интервью',
    offer: 'Оффер',
    rejected: 'Отказ',
  };

  // @ts-ignore
  const currentStyle = styles[status] || styles.new;
  // @ts-ignore
  const currentLabel = labels[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStyle}`}>
      {currentLabel}
    </span>
  );
}