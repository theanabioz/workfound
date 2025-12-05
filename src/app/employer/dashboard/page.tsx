import Link from 'next/link';
import { getCurrentUser, getJobs } from '@/lib/supabase-service';

export default async function EmployerDashboard() {
  const currentUser = await getCurrentUser();
  
  // Если не залогинен или не работодатель — редирект (лучше делать в Middleware, но пока так)
  if (!currentUser || currentUser.role !== 'employer') {
    return <div className="p-8">Доступ запрещен. Пожалуйста, войдите как работодатель.</div>;
  }
  
  const allJobs = await getJobs();
  // Фильтруем на клиенте (в будущем лучше делать .eq('employer_id') в запросе)
  const myJobs = allJobs.filter(job => job.employerId === currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Шапка Дашборда */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
            <p className="text-gray-500">{currentUser.companyName || currentUser.fullName}</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/employer/applications"
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
            >
              Входящие отклики
            </Link>
            <Link 
              href="/employer/jobs/new"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              + Создать вакансию
            </Link>
          </div>
        </div>

        {/* Статистика (Заглушка) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Активных вакансий</p>
            <p className="text-3xl font-bold">{myJobs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Всего просмотров</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Новых откликов</p>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
        </div>

        {/* Список Вакансий */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Мои вакансии</h2>
          </div>
          
          {myJobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              У вас пока нет активных вакансий.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Название</th>
                  <th className="px-6 py-3 font-medium">Тип найма</th>
                  <th className="px-6 py-3 font-medium">Статус</th>
                  <th className="px-6 py-3 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myJobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-400">{job.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      {job.applicationMethod === 'internal_ats' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          ATS (Полный цикл)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Быстрый контакт
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-green-600 font-medium">Активна</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Ред.</button>
                      <button className="text-red-600 hover:text-red-800">Закрыть</button>
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