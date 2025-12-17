import Link from 'next/link';
import { getJobById, checkIsSaved, getSimilarJobs } from '@/lib/supabase-service';
import { Navbar } from '@/components/Navbar';
import { SaveButton } from '@/components/SaveButton';
import { ApplySection } from '@/components/ApplySection';
import { SiteFooter } from '@/components/SiteFooter';
import { JobCard } from '@/components/JobCard';
import { ViewTracker } from '@/components/ViewTracker';
import { MapPin, Banknote, Clock, Building2, ChevronLeft, Globe, CheckCircle2, Calendar, Share2, Eye } from 'lucide-react';

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobById(id);
  const isSaved = await checkIsSaved(id);

  if (!job) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900">Вакансия не найдена</h1>
      <Link href="/" className="text-blue-600 hover:underline mt-4">На главную</Link>
    </div>
  );

  const similarJobs = await getSimilarJobs(id, job.location);
  const isDirectHiring = job.applicationMethod !== 'internal_ats';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <ViewTracker jobId={id} />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* BREADCRUMBS */}
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black mb-6 text-sm font-medium transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Назад к вакансиям
        </Link>

        {/* HEADER CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Logo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-50 flex items-center justify-center text-4xl font-bold text-gray-400 border border-gray-100 shadow-sm shrink-0 overflow-hidden">
              {job.company?.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
              ) : (
                job.title.charAt(0)
              )}
            </div>

            {/* Middle: Title & Meta */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  <Link href={`/company/${job.company?.slug}`} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors font-medium">
                    <Building2 className="w-4 h-4" />
                    {job.company?.name || 'Компания'}
                  </Link>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1.5" title="Просмотры">
                    <Eye className="w-4 h-4" />
                    {job.views}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Salary & Actions */}
            <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px]">
              <div className="text-right w-full">
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  {job.salaryRange}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {job.salaryPeriod === 'hour' ? 'в час' : job.salaryPeriod === 'year' ? 'в год' : 'в месяц'}
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto mt-auto">
                <SaveButton itemId={job.id} itemType="job" initialSaved={isSaved} />
                <div className="flex-1 md:flex-none">
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
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (Main Content) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Description Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                Описание вакансии
              </h2>
              <div className="prose prose-gray max-w-none leading-relaxed text-gray-600 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Company Info Card */}
            {job.company && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">О работодателе</h2>
                <div className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-400 border border-gray-200 overflow-hidden shrink-0">
                    {job.company.logoUrl ? (
                      <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      job.company.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{job.company.name}</h3>
                    {job.company.website && (
                      <a href={job.company.website} target="_blank" className="text-blue-600 text-sm flex items-center gap-1 mb-3 hover:underline">
                        <Globe className="w-3 h-3" /> Веб-сайт
                      </a>
                    )}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {job.company.description || 'Информация о компании отсутствует.'}
                    </p>
                    <Link href={`/company/${job.company.slug}`} className="text-sm font-medium text-black border-b border-black/20 hover:border-black transition-colors">
                      Смотреть профиль компании →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Похожие вакансии</h2>
                <div className="grid gap-4">
                  {similarJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Benefits Card */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Что мы предлагаем</h3>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <div className="mt-0.5 bg-green-100 text-green-700 p-0.5 rounded-full shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Details Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Детали</h3>
              <div className="space-y-4">
                <DetailRow icon={Calendar} label="Опубликовано" value={new Date(job.createdAt).toLocaleDateString()} />
                <DetailRow icon={Clock} label="Занятость" value="Полная занятость" />
                <DetailRow icon={MapPin} label="Локация" value={job.location} />
              </div>
            </div>

            {/* Safety Banner */}
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
              <p className="font-bold mb-1">Безопасность</p>
              <p>Никогда не платите деньги за трудоустройство. Сообщите нам, если заметите что-то подозрительное.</p>
            </div>

          </div>

        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="p-2 bg-gray-50 rounded-lg text-gray-500 border border-gray-100">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <span className="block text-xs text-gray-400 font-medium">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
    </div>
  );
}
