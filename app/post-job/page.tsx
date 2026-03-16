'use client';

import Header from '@/components/layout/Header';
import { Briefcase, MapPin, Euro, FileText, CheckCircle2, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';

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
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    salary: '',
    description: '',
    benefits: [] as string[]
  });

  useEffect(() => {
    async function fetchJob() {
      if (!isEditing || !editId) return;
      
      try {
        const { data, error } = await supabase
          .from('vacancies')
          .select('*')
          .eq('id', editId)
          .single();
          
        if (error) throw error;
        if (data) {
          setFormData({
            title: data.title || '',
            category: data.category || '',
            location: data.location || '',
            salary: data.salary || '',
            description: data.description || '',
            benefits: data.benefits || []
          });
        }
      } catch (err: any) {
        console.error('Error fetching job:', err);
        setError('Не удалось загрузить данные вакансии.');
      } finally {
        setIsFetching(false);
      }
    }

    fetchJob();
  }, [isEditing, editId, supabase]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Вы должны быть авторизованы для публикации вакансии.');
      }

      const jobData = {
        employer_id: user.id,
        title: formData.title,
        category: formData.category,
        location: formData.location,
        salary: formData.salary,
        description: formData.description,
        benefits: formData.benefits,
        status: 'active'
      };

      if (isEditing && editId) {
        const { error: updateError } = await supabase
          .from('vacancies')
          .update(jobData)
          .eq('id', editId)
          .eq('employer_id', user.id); // Security check

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('vacancies')
          .insert([jobData]);

        if (insertError) throw insertError;
      }

      router.push('/dashboard/employer/jobs');
      router.refresh();
    } catch (err: any) {
      console.error('Error saving job:', err);
      if (err.details) console.error('Error details:', err.details);
      if (err.hint) console.error('Error hint:', err.hint);
      setError(err.message || 'Произошла ошибка при сохранении вакансии.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-slate-500">Загрузка данных вакансии...</div>;
  }

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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Title & Category */}
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Название должности <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="title"
                required
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
                  required
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
                  required
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
                required
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
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEditing ? (
              <Save className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {isLoading ? 'Сохранение...' : isEditing ? 'Сохранить изменения' : 'Опубликовать'}
          </button>
        </div>
      </form>
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
