import Header from '@/components/layout/Header';
import { Briefcase, MapPin, Euro, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link href="/dashboard/employer" className="text-sm font-semibold text-blue-600 hover:text-blue-700 mb-4 inline-block">
            &larr; Назад в панель управления
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Разместить вакансию</h1>
          <p className="text-slate-500 mt-2 text-lg">Заполните детали, чтобы найти лучших кандидатов</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/75 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Title & Category */}
            <section className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Название должности <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Например: Водитель-дальнобойщик CE" 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-slate-900" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Категория <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Briefcase className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <select className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none text-slate-900">
                    <option value="" disabled selected>Выберите категорию</option>
                    <option>Транспорт и логистика</option>
                    <option>Строительство</option>
                    <option>Производство</option>
                    <option>Склад и логистика</option>
                  </select>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Location & Salary */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Место работы <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    placeholder="Город, Страна" 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-slate-900" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Зарплата (в месяц)</label>
                <div className="relative">
                  <Euro className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    placeholder="Например: 2500 - 3000" 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-slate-900" 
                  />
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Description */}
            <section className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Описание вакансии <span className="text-red-500">*</span></label>
                <textarea 
                  rows={6} 
                  placeholder="Опишите обязанности, условия работы и требования к кандидату..." 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-slate-900"
                ></textarea>
              </div>
            </section>

            {/* Tags/Benefits */}
            <section>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Преимущества (выберите подходящие)</label>
              <div className="flex flex-wrap gap-3">
                {['Жилье предоставляется', 'Официальное трудоустройство', 'Бесплатное питание', 'Транспорт до работы', 'Медицинская страховка', 'Обучение'].map((tag) => (
                  <label key={tag} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                    <span className="text-sm font-medium text-slate-700">{tag}</span>
                  </label>
                ))}
              </div>
            </section>

          </div>
          
          <div className="bg-slate-50 p-6 sm:px-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 font-medium">
              Публикуя вакансию, вы соглашаетесь с правилами сервиса.
            </p>
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Опубликовать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
