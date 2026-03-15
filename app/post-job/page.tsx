'use client';

import Header from '@/components/layout/Header';
import { Briefcase, MapPin, Euro, FileText, CheckCircle2, Save } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

// Mock data to simulate fetching a job by ID
const MOCK_JOBS: Record<string, any> = {
  '1': {
    title: 'Водитель-дальнобойщик категории CE',
    category: 'Транспорт и логистика',
    location: 'Варшава, Польша',
    salary: '2500 - 3000',
    description: 'Требуется опытный водитель категории CE для международных перевозок по Европе. Опыт работы от 2 лет. Наличие чип-карты и кода 95 обязательно. Автопарк: Mercedes Actros, Volvo FH (Евро 6).',
    benefits: ['Жилье предоставляется', 'Официальное трудоустройство', 'Медицинская страховка']
  },
  '2': {
    title: 'Сварщик MIG/MAG',
    category: 'Производство',
    location: 'Гданьск, Польша',
    salary: '1800 - 2200',
    description: 'Ищем сварщиков MIG/MAG на судостроительный завод. Работа в цеху. Предоставляем рабочую одежду и инструмент. Требуется сертификат и опыт работы от 1 года.',
    benefits: ['Жилье предоставляется', 'Официальное трудоустройство']
  },
  '3': {
    title: 'Монтажник строительных лесов',
    category: 'Строительство',
    location: 'Берлин, Германия',
    salary: '2000 - 2500',
    description: 'Монтаж и демонтаж строительных лесов на объектах. Работа в бригаде. Знание техники безопасности.',
    benefits: ['Жилье предоставляется', 'Транспорт до работы']
  },
  '4': {
    title: 'Разнорабочий на склад',
    category: 'Склад и логистика',
    location: 'Прага, Чехия',
    salary: '1200 - 1500',
    description: 'Комплектация заказов, упаковка товаров, работа со сканером. Опыт не требуется, обучаем на месте.',
    benefits: ['Официальное трудоустройство', 'Бесплатное питание', 'Обучение']
  }
};

const AVAILABLE_BENEFITS = [
  'Жилье предоставляется', 
  'Официальное трудоустройство', 
  'Бесплатное питание', 
  'Транспорт до работы', 
  'Медицинская страховка', 
  'Обучение'
];

function PostJobForm() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    salary: '',
    description: '',
    benefits: [] as string[]
  });

  useEffect(() => {
    if (isEditing && editId && MOCK_JOBS[editId]) {
      setFormData(MOCK_JOBS[editId]);
    }
  }, [isEditing, editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBenefitToggle = (benefit: string) => {
    setFormData(prev => {
      const currentBenefits = prev.benefits || [];
      if (currentBenefits.includes(benefit)) {
        return { ...prev, benefits: currentBenefits.filter(b => b !== benefit) };
      } else {
        return { ...prev, benefits: [...currentBenefits, benefit] };
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/dashboard/employer/jobs" className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 inline-block transition-colors">
          &larr; Назад к вакансиям
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isEditing ? 'Редактировать вакансию' : 'Разместить вакансию'}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          {isEditing ? 'Внесите изменения в существующую вакансию' : 'Заполните детали, чтобы найти лучших кандидатов'}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Title & Category */}
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Название должности <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Например: Водитель-дальнобойщик CE" 
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm text-slate-900" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Категория <span className="text-red-500">*</span></label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors appearance-none text-sm text-slate-900"
                >
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
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
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
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
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
                name="description"
                value={formData.description}
                onChange={handleChange}
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
              {AVAILABLE_BENEFITS.map((tag) => (
                <label key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={(formData.benefits || []).includes(tag)}
                    onChange={() => handleBenefitToggle(tag)}
                    className="w-3.5 h-3.5 text-slate-900 rounded border-slate-300 focus:ring-slate-900" 
                  />
                  <span className="text-xs font-medium text-slate-700">{tag}</span>
                </label>
              ))}
            </div>
          </section>

        </div>
        
        <div className="bg-slate-50 p-6 sm:px-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            {isEditing 
              ? 'Изменения будут применены сразу после сохранения.' 
              : 'Публикуя вакансию, вы соглашаетесь с правилами сервиса.'}
          </p>
          <button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Сохранить изменения
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Опубликовать
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Header />
      <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-12 text-center text-slate-500">Загрузка...</div>}>
        <PostJobForm />
      </Suspense>
    </div>
  );
}
