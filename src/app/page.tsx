import { getJobs, getSavedJobIds, JobFilters } from "@/lib/supabase-service";
import { Navbar } from "@/components/Navbar";
import { JobCard } from "@/components/JobCard";
import { FilterBar } from "@/components/FilterBar";
import { Search } from 'lucide-react';

// Server Component
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  
  // Собираем фильтры из URL
  const filters: JobFilters = {
    query,
    country: params.country,
    city: params.city,
    minSalary: params.minSalary ? parseInt(params.minSalary) : undefined,
    salaryPeriod: params.salaryPeriod as 'hour' | 'month' | 'year',
    // benefits: params.benefits ? params.benefits.split(',') : undefined
  };

  const [jobs, savedIds] = await Promise.all([
    getJobs(filters),
    getSavedJobIds()
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* COMPACT HERO & SEARCH */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form action="/" method="GET" className="relative group">
            <div className="relative flex items-center bg-gray-100 hover:bg-white focus-within:bg-white rounded-xl border border-transparent focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
              <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                className="w-full h-12 pl-3 pr-4 bg-transparent border-none focus:ring-0 text-base placeholder-gray-500 text-gray-900"
                placeholder="Должность, компания или навык..."
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-black text-white px-6 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Найти
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR (FILTERS) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-36">
              <FilterBar />
            </div>
          </div>

          {/* MAIN CONTENT (JOBS) */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {query ? `Результаты поиска` : 'Рекомендации для вас'}
              </h2>
              <span className="text-sm text-gray-500">
                Найдено {jobs.length} вакансий
              </span>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-lg font-medium">Ничего не найдено.</p>
                <a href="/" className="text-black underline mt-2 block">Сбросить фильтры</a>
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} isSaved={savedIds.includes(job.id)} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-center text-xs text-gray-400 mt-auto">
        <p>&copy; {new Date().getFullYear()} Workfound.</p>
      </footer>
    </main>
  );
}