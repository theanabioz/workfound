import Link from 'next/link';
import { getCurrentUser, getEmployerJobs } from '@/lib/supabase-service';
import { Plus, Search, Briefcase, MapPin, Calendar } from 'lucide-react';

export default async function MyJobsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'employer') {
    return <div className="p-8">Доступ запрещен.</div>;
  }

  const jobs = await getEmployerJobs(currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Мои Вакансии</h1>
            <p className="text-gray-500">Управляйте своими объявлениями</p>
          </div>
          <Link 
            href="/employer/jobs/new"
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Создать вакансию
          </Link>
        </div>

        {/* Filters Bar (Заглушка пока) */}
        <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Поиск по названию..." 
              className="w-full pl-9 pr-4 py-2 text-sm border-none focus:ring-0 rounded-md text-gray-700"
            />
          </div>
          <select className="bg-gray-50 border-none text-sm rounded-md px-4 py-2 text-gray-600 focus:ring-0 cursor-pointer hover:bg-gray-100">
            <option>Все статусы</option>
            <option>Активные</option>
            <option>Закрытые</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {jobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Нет вакансий</h3>
              <p className="text-gray-500 mt-2 mb-6">Вы еще не опубликовали ни одной вакансии.</p>
              <Link href="/employer/jobs/new" className="text-blue-600 font-medium hover:underline">
                Создать первую вакансию
              </Link>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Должность</th>
                  <th className="px-6 py-4 font-medium">Кандидаты</th>
                  <th className="px-6 py-4 font-medium">Дата</th>
                  <th className="px-6 py-4 font-medium text-right">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 group transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/jobs/${job.id}`} className="font-medium text-gray-900 hover:text-blue-600 block">
                        {job.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span>{job.salaryRange}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/employer/applications?jobId=${job.id}`} className="text-sm text-gray-600 hover:text-black inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                        Смотреть отклики
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <StatusBadge status={job.status} />
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
    published: 'bg-green-100 text-green-700 border-green-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    closed: 'bg-red-50 text-red-700 border-red-200',
  };
  
  const labels = {
    published: 'Активна',
    draft: 'Черновик',
    closed: 'Закрыта',
  };

  // @ts-ignore
  const style = styles[status] || styles.draft;
  // @ts-ignore
  const label = labels[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {label}
    </span>
  );
}
