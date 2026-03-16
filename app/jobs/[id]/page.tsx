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
    <div className="min-h-screen font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Вернуться к списку
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content - Job Details */}
          <div className="flex-1">
            <div className="bg-white border border-zinc-200 p-8 md:p-12 mb-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3 tracking-tight">{job.title}</h1>
                  <div className="text-lg text-zinc-600 mb-6 font-medium">{job.employer?.full_name || 'Прямой работодатель'}</div>
                  
                  <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-zinc-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-2 font-semibold text-zinc-900">
                        <Banknote className="w-4 h-4 text-zinc-400" />
                        {job.salary}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      {new Date(job.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                
                <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                  <Link href={`/jobs/${id}/apply`} className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3.5 font-medium transition-colors w-full text-center block">
                    Откликнуться
                  </Link>
                  <button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-8 py-3.5 font-medium transition-colors w-full flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Написать в WhatsApp
                  </button>
                  <button className="bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 px-8 py-3.5 font-medium transition-colors w-full flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Показать телефон
                  </button>
                </div>
              </div>

              {job.benefits && job.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-10 pb-10 border-b border-zinc-200">
                  {job.benefits.map((benefit: string, i: number) => (
                    <span key={i} className="border border-zinc-200 text-zinc-700 px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold">{benefit}</span>
                  ))}
                </div>
              )}

              <div className="space-y-10">
                <section>
                  <h2 className="text-lg font-bold text-zinc-900 mb-5 uppercase tracking-wider">Описание вакансии</h2>
                  <div className="text-zinc-700 space-y-4 leading-relaxed">
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
            <div className="bg-white border border-zinc-200 p-6 sticky top-24">
              <h3 className="font-bold text-zinc-900 mb-6 text-sm uppercase tracking-wider">О компании</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                  <Building2 className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900">{job.employer?.full_name || 'Прямой работодатель'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-700 bg-zinc-100 px-4 py-2.5 text-xs font-semibold mb-6 uppercase tracking-wider border border-zinc-200">
                <ShieldCheck className="w-4 h-4" />
                Компания проверена
              </div>

              <div className="space-y-4 text-sm text-zinc-600 mb-2">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                  <span className="text-zinc-500">Сфера:</span>
                  <span className="font-semibold text-zinc-900">{job.category || 'Не указана'}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                  <span className="text-zinc-500">Локация:</span>
                  <span className="font-semibold text-zinc-900">{job.location}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
