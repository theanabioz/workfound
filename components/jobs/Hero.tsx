import { Search, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-zinc-950 text-zinc-50 py-24 border-b border-zinc-800">
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
      </div>
    </section>
  );
}
