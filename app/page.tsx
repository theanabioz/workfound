import Hero from '@/components/jobs/Hero';
import JobFilters from '@/components/jobs/JobFilters';
import JobCard from '@/components/jobs/JobCard';
import JobListContainer from '@/components/jobs/JobListContainer';
import { createClient } from '@/utils/supabase/server';

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const supabase = await createClient();
  const params = await searchParams;
  
  let query = supabase
    .from('vacancies')
    .select(`
      *,
      employer:employer_id (
        full_name
      )
    `)
    .eq('status', 'active');

  // Apply filters from URL
  if (params.category) query = query.in('category', (params.category as string).split(','));
  if (params.country) query = query.in('location', (params.country as string).split(','));
  if (params.type) query = query.in('employment_type', (params.type as string).split(','));
  
  const { data: jobs, error } = await query.order('created_at', { ascending: false });

  return (
    <div className="min-h-screen font-sans">
      <Hero />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8 min-h-[800px]">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <JobFilters />
        </aside>

        {/* Job List Area */}
        <div className="flex-1">
          <JobListContainer>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-200">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                {jobs?.length ? `Найдено вакансий: ${jobs.length}` : 'Вакансии'}
              </h2>
              <select className="bg-transparent border-none text-zinc-600 py-2 pl-2 pr-8 text-sm focus:outline-none focus:ring-0 cursor-pointer font-medium">
                <option>Сначала новые</option>
                <option>Сначала с высокой зарплатой</option>
              </select>
            </div>

            <div className="bg-white border border-zinc-200">
              {error && (
                <div className="p-6 bg-red-50 text-red-700 border-b border-zinc-200">
                  Ошибка при загрузке вакансий.
                </div>
              )}
              
              {!error && jobs && jobs.length === 0 && (
                <div className="p-12 text-center text-zinc-500">
                  Актуальных вакансий по вашему запросу не найдено.
                </div>
              )}

              {!error && jobs && jobs.map((job) => (
                <JobCard 
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.employer?.full_name || 'Прямой работодатель'}
                  location={job.location}
                  salary={job.salary}
                  tags={job.benefits || []}
                  description={job.description}
                  postedAt={new Date(job.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short'
                  })}
                />
              ))}
            </div>
          </JobListContainer>
        </div>
      </main>
    </div>
  );
}
