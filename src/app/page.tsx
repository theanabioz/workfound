import { getJobs, getSavedJobIds, JobFilters } from "@/lib/supabase-service";
import { Navbar } from "@/components/Navbar";
import { JobCard } from "@/components/JobCard";
import { FilterBar } from "@/components/FilterBar";
import { MobileFilters } from "@/components/MobileFilters";
import { SiteFooter } from "@/components/SiteFooter";
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
  };

  const [jobs, savedIds] = await Promise.all([
    getJobs(filters),
    getSavedJobIds()
  ]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <MobileFilters />

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR (FILTERS) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <FilterBar />
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* SEARCH BAR & CHIPS */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <form action="/" method="GET" className="relative group">
                <div className="relative flex items-center bg-gray-50 hover:bg-white focus-within:bg-white rounded-lg border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                  <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    className="w-full h-12 pl-3 pr-4 bg-transparent border-none focus:ring-0 text-base placeholder-gray-500 text-gray-900"
                    placeholder="Должность, компания или навык..."
                  />
                  <button type="submit" className="absolute right-2 top-2 bottom-2 bg-black text-white px-6 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                    Найти
                  </button>
                </div>
              </form>

              {/* Quick Categories */}
              <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['Водитель', 'Строитель', 'Сварщик', 'Электрик', 'Курьер', 'Упаковщик'].map(cat => (
                  <a 
                    key={cat}
                    href={`/?q=${cat}`} 
                    className="px-3 py-1.5 rounded-md bg-gray-100 text-xs font-medium text-gray-600 hover:bg-black hover:text-white transition-colors whitespace-nowrap shrink-0 border border-transparent hover:border-black"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>

            {/* RESULTS HEADER */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {query ? `Результаты поиска` : 'Свежие вакансии'}
              </h2>
              <span className="text-sm text-gray-500">
                {jobs.length} вакансий
              </span>
            </div>

            {/* JOBS LIST */}
            {jobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
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
      
      <SiteFooter />
    </main>
  );
}
