import Header from '@/components/layout/Header';
import JobFilters from '@/components/jobs/JobFilters';
import JobCard from '@/components/jobs/JobCard';
import { Search, MapPin } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  
  const { data: jobs, error } = await supabase
    .from('vacancies')
    .select(`
      *,
      employer:employer_id (
        full_name
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-zinc-950 text-zinc-50 py-20 lg:py-28 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Надежная работа в Европе <br className="hidden md:block" />
            <span className="text-zinc-400">для специалистов</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-normal">
            Водители, строители, монтажники и другие рабочие специальности. Прямые контакты проверенных работодателей.
          </p>
          
          {/* Unified Search Bar */}
          <div className="max-w-4xl mx-auto bg-white p-1.5 flex flex-col sm:flex-row gap-1.5 border border-zinc-800">
            <div className="flex-1 flex items-center px-4 bg-white border border-zinc-200 focus-within:border-zinc-900 transition-colors">
              <Search className="w-5 h-5 text-zinc-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Профессия или ключевое слово" 
                className="w-full px-3 py-3.5 bg-transparent text-zinc-900 focus:outline-none placeholder:text-zinc-400"
              />
            </div>
            <div className="hidden sm:block w-px bg-zinc-200 my-2" />
            <div className="flex-1 flex items-center px-4 bg-white border border-zinc-200 focus-within:border-zinc-900 transition-colors">
              <MapPin className="w-5 h-5 text-zinc-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Страна или город" 
                className="w-full px-3 py-3.5 bg-transparent text-zinc-900 focus:outline-none placeholder:text-zinc-400"
              />
            </div>
            <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3.5 font-medium transition-colors">
              Найти работу
            </button>
          </div>
          
          {/* Quick tags */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <span>Популярное:</span>
            <a href="#" className="hover:text-zinc-300 transition-colors underline decoration-zinc-700 underline-offset-4">Водитель CE</a>
            <a href="#" className="hover:text-zinc-300 transition-colors underline decoration-zinc-700 underline-offset-4">Сварщик</a>
            <a href="#" className="hover:text-zinc-300 transition-colors underline decoration-zinc-700 underline-offset-4">Строитель</a>
            <a href="#" className="hover:text-zinc-300 transition-colors underline decoration-zinc-700 underline-offset-4">Германия</a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <JobFilters />
        </aside>

        {/* Job List */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-200">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Последние вакансии</h2>
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
                Актуальных вакансий пока нет.
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
                postedAt={new Date(job.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short'
                })}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
