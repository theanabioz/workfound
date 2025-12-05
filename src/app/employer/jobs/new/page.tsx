'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/lib/supabase-service';
import { Phone, FileText, CheckCircle2, MessageCircle, Plus, Trash2, HelpCircle } from 'lucide-react';
import { ApplicationMethod, JobQuestion } from '@/types';

export default function CreateJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [description, setDescription] = useState('');
  
  // Logic State
  const [method, setMethod] = useState<ApplicationMethod>('phone');
  const [contactInfo, setContactInfo] = useState('');

  // Questions State
  const [questions, setQuestions] = useState<JobQuestion[]>([]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', isDisqualifying: false }]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof JobQuestion, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    
    // Если выбрали "Критический", обязательно нужен правильный ответ
    if (field === 'isDisqualifying' && value === true && !newQuestions[index].correctAnswer) {
        newQuestions[index].correctAnswer = 'yes';
    }
    
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createJob({
        title,
        description,
        location,
        salaryRange,
        applicationMethod: method,
        contactInfo: method === 'internal_ats' ? undefined : contactInfo,
        status: 'published',
        questions: method === 'internal_ats' ? questions : [] // Вопросы только для ATS
      });

      router.push('/employer/dashboard');
    } catch (error) {
      console.error(error);
      alert('Ошибка при создании вакансии');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Новая вакансия</h1>
          <p className="mt-2 text-gray-600">Заполните детали, чтобы найти сотрудников.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Основная информация */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">О вакансии</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Название должности</label>
              <input 
                type="text" 
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
                placeholder="например, Электрик на стройку"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Город / Страна</label>
                <input 
                  type="text" 
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
                  placeholder="Берлин, Германия"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Зарплата</label>
                <input 
                  type="text" 
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
                  placeholder="2500 EUR / мес"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Описание вакансии</label>
              <textarea 
                required
                rows={5}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
                placeholder="Опишите обязанности и требования..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* 2. Способ связи */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Как с вами связаться?</h2>
              <p className="text-sm text-gray-500 mt-1">Выберите способ, который удобен именно вам.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col gap-3 transition-all ${
                  method !== 'internal_ats' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setMethod('phone')}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  {method !== 'internal_ats' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Прямой звонок / Мессенджер</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Кандидат видит ваш номер и звонит сразу.
                  </p>
                </div>
              </div>

              <div 
                className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col gap-3 transition-all ${
                  method === 'internal_ats' 
                    ? 'border-purple-600 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setMethod('internal_ats')}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  {method === 'internal_ats' && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Сбор резюме (ATS)</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Кандидаты отправляют отклик. Вы управляете ими в кабинете.
                  </p>
                </div>
              </div>
            </div>

            {/* QUESTIONS SECTION (Only for ATS) */}
            {method === 'internal_ats' && (
              <div className="pt-6 border-t border-gray-100 animate-in fade-in">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> Скрининг-вопросы
                    </h3>
                    <p className="text-sm text-gray-500">Задайте вопросы, чтобы отсеять неподходящих кандидатов.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Добавить вопрос
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                      <button 
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Текст вопроса</label>
                        <input 
                          type="text" 
                          placeholder="Например: Есть ли у вас виза?"
                          className="w-full rounded border-gray-300 text-sm px-3 py-2"
                          value={q.questionText}
                          onChange={(e) => handleQuestionChange(idx, 'questionText', e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-black focus:ring-black"
                            checked={q.isDisqualifying}
                            onChange={(e) => handleQuestionChange(idx, 'isDisqualifying', e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">Авто-отказ при неверном ответе?</span>
                        </label>

                        {q.isDisqualifying && (
                          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                            <span className="text-sm text-gray-700">Правильный ответ:</span>
                            <select 
                              className="text-sm border-gray-300 rounded px-2 py-1"
                              value={q.correctAnswer || 'yes'}
                              onChange={(e) => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
                            >
                              <option value="yes">Да</option>
                              <option value="no">Нет</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {questions.length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-400 italic border-2 border-dashed border-gray-200 rounded">
                      Нет вопросов. Кандидаты смогут откликнуться без них.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Direct Contact Fields */}
            {method !== 'internal_ats' && (
              <div className="pt-4 border-t border-gray-100 animate-in fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-2">Контакт для связи</label>
                <input 
                  type="text" 
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
                  placeholder="+49 151 12345678"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                />
              </div>
            )}

          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Публикация...' : 'Опубликовать вакансию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}