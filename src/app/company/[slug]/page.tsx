import { getCompanyBySlug, getCompanyJobsPublic } from '@/lib/supabase-service';
import { Navbar } from '@/components/Navbar';
import { JobCard } from '@/components/JobCard';
import { SiteFooter } from "@/components/SiteFooter";
import { Building2, Globe, MapPin } from 'lucide-react';
import Link from 'next/link';

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="p-12 text-center flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Компания не найдена</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-2 block">
            На главную
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const jobs = await getCompanyJobsPublic(company.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Cover / Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            
            {/* Logo */}
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border border-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400 shadow-sm overflow-hidden">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                company.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-gray-500">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <Globe className="w-4 h-4" />
                    {company.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {jobs.length} вакансий
                </div>
              </div>

              <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
                {company.description || 'Описание компании пока не добавлено.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-5xl mx-auto px-4 py-12 flex-1 w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Открытые вакансии</h2>
        
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            В данный момент вакансий нет.
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}