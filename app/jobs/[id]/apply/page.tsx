'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ApplyJobPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    coverLetter: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    params.then((resolvedParams) => {
      setJobId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      
      try {
        const { data, error } = await supabase
          .from('vacancies')
          .select('*')
          .eq('id', jobId)
          .single();

        if (error) throw error;
        setJob(data);
      } catch (err: any) {
        console.error('Error fetching job:', err);
        setError('Не удалось загрузить информацию о вакансии.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Пожалуйста, войдите в систему, чтобы откликнуться на вакансию.');
      }

      // Check if already applied
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('vacancy_id', jobId)
        .eq('applicant_id', user.id)
        .single();

      if (existingApplication) {
        throw new Error('Вы уже откликались на эту вакансию.');
      }

      const { error: submitError } = await supabase
        .from('applications')
        .insert([
          {
            vacancy_id: jobId,
            applicant_id: user.id,
            employer_id: job.employer_id,
            status: 'new',
            cover_letter: formData.coverLetter,
            contact_phone: formData.phone,
            contact_email: formData.email,
          }
        ]);

      if (submitError) throw submitError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/seeker/applications');
      }, 2000);

    } catch (err: any) {
      console.error('Error applying for job:', err);
      setError(err.message || 'Произошла ошибка при отправке отклика.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Link href="/" className="text-blue-600 hover:underline">Вернуться на главную</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/jobs/${jobId}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Вернуться к вакансии
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200/75 p-6 md:p-10 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Отклик на вакансию</h1>
          <p className="text-slate-600 mb-8 text-lg">{job?.title}</p>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-emerald-900 mb-2">Отклик успешно отправлен!</h2>
              <p className="text-emerald-700">Работодатель получит ваше резюме и сопроводительное письмо. Перенаправляем вас в личный кабинет...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
                  Контактный телефон
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                  Email для связи
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="coverLetter" className="block text-sm font-semibold text-slate-900 mb-2">
                  Сопроводительное письмо
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  placeholder="Напишите, почему вы подходите на эту должность..."
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    'Отправить отклик'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
