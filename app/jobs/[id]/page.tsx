import Header from '@/components/layout/Header';
import { MapPin, Banknote, Clock, Building2, CheckCircle2, Phone, MessageCircle, ShieldCheck, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job, error } = await supabase
    .from('vacancies')
    .select(`
      *,
      employer:employer_id (
        full_name
      )
    `)
    .eq('id', id)
    .single();

  if (error || !job) {
    notFound();
  }

  // Split description by newlines for better formatting
  const descriptionParagraphs = job.description ? job.description.split('\n').filter((p: string) => p.trim() !== '') : [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Вернуться к списку
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content - Job Details */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl border border-slate-200/75 p-6 md:p-10 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{job.title}</h1>
                  <div className="text-xl text-slate-600 mb-6 font-medium">{job.employer?.full_name || 'Прямой работодатель'}</div>
                  
                  <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2 font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg text-base">
                        <Banknote className="w-5 h-5 text-emerald-600" />
                        {job.salary}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-slate-400" />
                      {new Date(job.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                
                <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                  <Link href={`/jobs/${id}/apply`} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 w-full text-center block">
                    Откликнуться
                  </Link>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 w-full flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Написать в WhatsApp
                  </button>
                  <button className="bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-3.5 rounded-xl font-semibold transition-all w-full flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Показать телефон
                  </button>
                </div>
              </div>

              {job.benefits && job.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-10 pb-10 border-b border-slate-100">
                  {job.benefits.map((benefit: string, i: number) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">{benefit}</span>
                  ))}
                </div>
              )}

              <div className="space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-5 tracking-tight">Описание вакансии</h2>
                  <div className="text-slate-700 space-y-4 leading-relaxed text-lg">
                    {descriptionParagraphs.map((p: string, i: number) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Company Info */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl border border-slate-200/75 p-6 sticky top-24 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6 text-lg tracking-tight">О компании</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Building2 className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg">{job.full_name || 'Прямой работодатель'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl text-sm font-semibold mb-6">
                <ShieldCheck className="w-5 h-5" />
                Компания проверена
              </div>

              <div className="space-y-4 text-sm text-slate-600 mb-8">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Сфера:</span>
                  <span className="font-semibold text-slate-900">{job.category || 'Не указана'}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Локация:</span>
                  <span className="font-semibold text-slate-900">{job.location}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
