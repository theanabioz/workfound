import Header from '@/components/layout/Header';
import { Briefcase, MapPin, Euro, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard/employer" className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 inline-block transition-colors">
            &larr; Назад в панель управления
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Разместить вакансию</h1>
          <p className="text-slate-500 mt-1 text-sm">Заполните детали, чтобы найти лучших кандидатов</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Title & Category */}
            <section className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Название должности <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Например: Водитель-дальнобойщик CE" 
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm text-slate-900" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Категория <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select defaultValue="" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors appearance-none text-sm text-slate-900">
                    <option value="" disabled>Выберите категорию</option>
                    <option value="Транспорт и логистика">Транспорт и логистика</option>
                    <option value="Строительство">Строительство</option>
                    <option value="Производство">Производство</option>
                    <option value="Склад и логистика">Склад и логистика</option>
                  </select>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Location & Salary */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Место работы <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    placeholder="Город, Страна" 
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm text-slate-900" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Зарплата (в месяц)</label>
                <div className="relative">
                  <Euro className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    placeholder="Например: 2500 - 3000" 
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm text-slate-900" 
                  />
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Description */}
            <section className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Описание вакансии <span className="text-red-500">*</span></label>
                <textarea 
                  rows={6} 
                  placeholder="Опишите обязанности, условия работы и требования к кандидату..." 
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors resize-none text-sm text-slate-900"
                ></textarea>
              </div>
            </section>

            {/* Tags/Benefits */}
            <section>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Преимущества (выберите подходящие)</label>
              <div className="flex flex-wrap gap-2">
                {['Жилье предоставляется', 'Официальное трудоустройство', 'Бесплатное питание', 'Транспорт до работы', 'Медицинская страховка', 'Обучение'].map((tag) => (
                  <label key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-colors">
                    <input type="checkbox" className="w-3.5 h-3.5 text-slate-900 rounded border-slate-300 focus:ring-slate-900" />
                    <span className="text-xs font-medium text-slate-700">{tag}</span>
                  </label>
                ))}
              </div>
            </section>

          </div>
          
          <div className="bg-slate-50 p-6 sm:px-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-medium">
              Публикуя вакансию, вы соглашаетесь с правилами сервиса.
            </p>
            <button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Опубликовать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
