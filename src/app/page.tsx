import { getJobs, getSavedJobIds } from "@/lib/supabase-service";
import { Navbar } from "@/components/Navbar";
import { JobCard } from "@/components/JobCard";
import { Search } from 'lucide-react';

// Server Component получает searchParams
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Асинхронное получение параметров в Next.js 15
  const params = await searchParams;
  const query = params.q || '';
  
  // Параллельный запрос данных для скорости
  const [jobs, savedIds] = await Promise.all([
    getJobs(query),
    getSavedJobIds()
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Compact Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Работа в Европе</h1>
          <p className="text-gray-500 text-sm mb-6">
            {query 
              ? `Результаты поиска по запросу "${query}": ${jobs.length}` 
              : `Найдено ${jobs.length} активных вакансий.`
            }
          </p>
          
          {/* Search Form */}
          <form action="/" method="GET" className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition-shadow"
              placeholder="Какую работу ищете? (например, Водитель)"
            />
          </form>
        </div>
      </div>

      {/* Job List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">По вашему запросу ничего не найдено.</p>
            {query && (
               <a href="/" className="text-blue-600 hover:underline mt-2 inline-block">Сбросить фильтр</a>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} isSaved={savedIds.includes(job.id)} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}