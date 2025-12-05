import Link from 'next/link';
import { getSavedJobs } from '@/lib/supabase-service';
import { JobCard } from '@/components/JobCard';
import { ArrowLeft, Bookmark } from 'lucide-react';

export default async function SavedJobsPage() {
  const jobs = await getSavedJobs();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/seeker/dashboard" className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Избранное</h1>
            <p className="text-gray-500">Вакансии, которые вы сохранили</p>
          </div>
        </div>

        {/* List */}
        {jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center border border-gray-200 border-dashed">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Список пуст</h3>
            <p className="text-gray-500 mt-2 mb-6">
              Нажимайте на сердечко рядом с вакансией, чтобы сохранить её здесь.
            </p>
            <Link href="/" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Искать вакансии
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              // Передаем isSaved={true}, так как мы точно знаем, что они сохранены
              <JobCard key={job.id} job={job} isSaved={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
