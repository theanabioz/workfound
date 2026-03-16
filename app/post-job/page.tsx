'use client';

import { Briefcase, MapPin, Euro, FileText, CheckCircle2, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CATEGORIES, COUNTRIES } from '@/utils/constants';

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
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-zinc-500 font-medium tracking-wider uppercase text-xs">Загрузка данных вакансии...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/dashboard/employer/jobs" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 mb-6 inline-block transition-colors">
          &larr; Назад к вакансиям
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          {isEditing ? 'Редактировать вакансию' : 'Разместить вакансию'}
        </h1>
        <p className="text-zinc-500 mt-2 text-sm">
          {isEditing ? 'Внесите изменения в существующую вакансию' : 'Заполните детали, чтобы найти лучших кандидатов'}
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 overflow-hidden">
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Title & Category */}
          <section className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Название должности <span className="text-red-600">*</span></label>
              <input 
                type="text" 
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Например: Водитель-дальнобойщик CE" 
                className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-colors text-sm text-zinc-900" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Категория <span className="text-red-600">*</span></label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
                <select 
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-colors appearance-none text-sm text-zinc-900"
                >
                  <option value="" disabled>Выберите категорию</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
          </section>

          <hr className="border-zinc-200" />

          {/* Location & Salary */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Страна <span className="text-red-600">*</span></label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
                <select 
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-colors appearance-none text-sm text-zinc-900"
                >
                  <option value="" disabled>Выберите страну</option>
                  {COUNTRIES.map(country => <option key={country} value={country}>{country}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Зарплата (в месяц)</label>
              <div className="relative">
                <Euro className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
                <input 
                  type="text" 
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Например: 2500 - 3000" 
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-colors text-sm text-zinc-900" 
                />
              </div>
            </div>
          </section>

          <hr className="border-zinc-200" />

          {/* Description */}
          <section className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Описание вакансии <span className="text-red-600">*</span></label>
              <textarea 
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={8} 
                placeholder="Опишите обязанности, условия работы и требования к кандидату..." 
                className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-colors resize-none text-sm text-zinc-900"
              ></textarea>
            </div>
          </section>

          {/* Tags/Benefits */}
          <section>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">Преимущества (выберите подходящие)</label>
            <div className="flex flex-wrap gap-3">
              {AVAILABLE_BENEFITS.map((tag) => (
                <label key={tag} className="flex items-center gap-2 px-4 py-2.5 bg-zinc-50 border border-zinc-200 cursor-pointer hover:bg-zinc-100 hover:border-zinc-300 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={(formData.benefits || []).includes(tag)}
                    onChange={() => handleBenefitToggle(tag)}
                    className="w-4 h-4 text-zinc-900 rounded-none border-zinc-300 focus:ring-zinc-900" 
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700">{tag}</span>
                </label>
              ))}
            </div>
          </section>

        </div>
        
        <div className="bg-zinc-50 p-6 sm:px-10 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
            {isEditing 
              ? 'Изменения будут применены сразу после сохранения.' 
              : 'Публикуя вакансию, вы соглашаетесь с правилами сервиса.'}
          </p>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-700 text-white px-8 py-3.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
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
    <div className="min-h-screen bg-zinc-50 font-sans pb-20">
      <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-12 text-center text-zinc-500 font-medium tracking-wider uppercase text-xs">Загрузка...</div>}>
        <PostJobForm />
      </Suspense>
    </div>
  );
}
