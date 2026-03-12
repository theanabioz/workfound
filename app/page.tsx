import Header from '@/components/layout/Header';
import JobFilters from '@/components/jobs/JobFilters';
import JobCard from '@/components/jobs/JobCard';
import { Search, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 lg:py-28 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-indigo-600/20 blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Надежная работа в Европе <br className="hidden md:block" />
            <span className="text-blue-400">для специалистов</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            Водители, строители, монтажники и другие рабочие специальности. Прямые контакты проверенных работодателей.
          </p>
          
          {/* Unified Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl shadow-black/20">
            <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-xl border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Профессия или ключевое слово" 
                className="w-full px-3 py-3.5 bg-transparent text-slate-900 focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="hidden sm:block w-px bg-slate-200 my-2" />
            <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-xl border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Страна или город" 
                className="w-full px-3 py-3.5 bg-transparent text-slate-900 focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-md shadow-blue-600/20">
              Найти работу
            </button>
          </div>
          
          {/* Quick tags */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-300">
            <span className="opacity-70">Популярное:</span>
            <a href="#" className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Водитель CE</a>
            <a href="#" className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Сварщик</a>
            <a href="#" className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Строитель</a>
            <a href="#" className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4">Германия</a>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Последние вакансии</h2>
            <select className="bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
              <option>Сначала новые</option>
              <option>Сначала с высокой зарплатой</option>
            </select>
          </div>
          
          <div className="space-y-4">
            <JobCard 
              id="1"
              title="Водитель-дальнобойщик категории CE"
              company="TransLogistics GmbH"
              location="Германия, Мюнхен"
              salary="€2,500 - €3,000"
              tags={['Жилье предоставляется', 'Официальное трудоустройство']}
              postedAt="2 часа назад"
              isPremium={true}
            />
            <JobCard 
              id="2"
              title="Строитель-универсал (внутренняя отделка)"
              company="BuildEuro Sp. z o.o."
              location="Польша, Варшава"
              salary="от €1,800"
              tags={['Без знания языка', 'Оплата каждую неделю']}
              postedAt="5 часов назад"
            />
            <JobCard 
              id="3"
              title="Сварщик MIG/MAG"
              company="MetalWorks s.r.o."
              location="Чехия, Прага"
              salary="€2,000 - €2,400"
              tags={['Бесплатное проживание', 'Спецодежда']}
              postedAt="1 день назад"
            />
            <JobCard 
              id="4"
              title="Монтажник солнечных панелей"
              company="EcoEnergy B.V."
              location="Нидерланды, Амстердам"
              salary="€2,200 - €2,800"
              tags={['Обучение', 'Транспорт до работы']}
              postedAt="1 день назад"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
