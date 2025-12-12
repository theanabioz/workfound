import Link from 'next/link';
import { getJobById, checkIsSaved } from '@/lib/supabase-service';
import { Navbar } from '@/components/Navbar';
import { SaveButton } from '@/components/SaveButton';
import { ApplySection } from '@/components/ApplySection';
import { MapPin, Banknote, Clock, Building2, Share2, ChevronLeft, Globe, CheckCircle2 } from 'lucide-react';

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobById(id);
  const isSaved = await checkIsSaved(id);

  if (!job) return <div className="p-12 text-center">Вакансия не найдена.</div>;

  const isDirectHiring = job.applicationMethod !== 'internal_ats';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-4 text-sm font-medium transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Назад к поиску
          </Link>

          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* Logo */}
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500 shrink-0 border border-gray-200">
                {job.company?.logoUrl ? (
                  <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  job.title.charAt(0)
                )}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                    <Building2 className="w-4 h-4" />
                    {job.company?.name || 'Компания'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">
                    <Banknote className="w-4 h-4" />
                    {job.salaryRange}
                    {job.salaryPeriod === 'hour' && ' / ч'}
                    {job.salaryPeriod === 'month' && ' / мес'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <SaveButton itemId={job.id} itemType="job" initialSaved={isSaved} />
              
              <ApplySection 
                jobId={job.id} 
                jobTitle={job.title} 
                isDirect={isDirectHiring} 
                contactInfo={job.contactInfo} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (Description) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description Card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Описание вакансии</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {job.description}
              </div>
            </div>

            {/* Company Card */}
            {job.company && (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">О компании</h2>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{job.company.name}</h3>
                    {job.company.website && (
                      <a href={job.company.website} target="_blank" className="text-blue-600 text-sm flex items-center gap-1 mb-3 hover:underline">
                        <Globe className="w-3 h-3" /> Сайт компании
                      </a>
                    )}
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                      {job.company.description || 'Описание отсутствует.'}
                    </p>
                    <Link href={`/company/${job.company.slug}`} className="text-sm font-medium text-black underline">
                      Посмотреть профиль и все вакансии
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Предлагаем</h3>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Детали</h3>
              <div className="space-y-4">
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Опубликовано</span>
                  <span className="text-sm font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Тип занятости</span>
                  <span className="text-sm font-medium">Полная занятость</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Локация</span>
                  <span className="text-sm font-medium">{job.location}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}