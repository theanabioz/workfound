'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getJobById } from '@/lib/supabase-service';
import { Job } from '@/types';
import { MapPin, Banknote, Clock, ArrowLeft, Phone, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';

import { Navbar } from '@/components/Navbar';

export default function JobDetailsPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (typeof params.id === 'string') {
        const data = await getJobById(params.id);
        setJob(data);
      }
      setLoading(false);
    };
    fetchJob();
  }, [params.id]);

  if (loading) return <div className="p-12 text-center text-gray-500">Загрузка вакансии...</div>;
  if (!job) return <div className="p-12 text-center text-red-500">Вакансия не найдена.</div>;

  const isDirectHiring = job.applicationMethod !== 'internal_ats';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Заголовок и мета-данные */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md">
              <MapPin className="w-4 h-4 text-gray-400" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-md font-medium">
              <Banknote className="w-4 h-4" />
              {job.salaryRange}
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md">
              <Clock className="w-4 h-4 text-gray-400" />
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Сетка: Описание (2/3) + Действие (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Левая колонка: Описание */}
          <div className="md:col-span-2 space-y-8">
            <div className="prose max-w-none text-gray-800 whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Правая колонка: CTA (Call to Action) */}
          <div className="md:col-span-1">
            <div className="sticky top-24 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Интересует эта работа?</h3>
              
              {isDirectHiring ? (
                // Direct Contact Logic
                <div className="space-y-3">
                  {!showPhone ? (
                    <button 
                      onClick={() => setShowPhone(true)}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Показать контакты
                    </button>
                  ) : (
                    <div className="animate-in fade-in zoom-in duration-200">
                       <div className="p-3 bg-white rounded border border-gray-200 text-center mb-3">
                         <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Телефон</p>
                         <a href={`tel:${job.contactInfo}`} className="text-xl font-bold text-gray-900 hover:text-blue-600">
                           {job.contactInfo}
                         </a>
                       </div>
                       
                       {job.applicationMethod === 'whatsapp' && (
                         <a 
                           href={`https://wa.me/${job.contactInfo?.replace(/[^0-9]/g, '')}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                         >
                           <MessageCircle className="w-5 h-5" />
                           Открыть WhatsApp
                         </a>
                       )}
                       
                       {job.applicationMethod === 'viber' && (
                         <a 
                           href={`viber://chat?number=${job.contactInfo?.replace(/[^0-9]/g, '')}`}
                           className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                         >
                           <MessageCircle className="w-5 h-5" />
                           Открыть Viber
                         </a>
                       )}
                    </div>
                  )}
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Скажите работодателю, что нашли вакансию на Workfound
                  </p>
                </div>
              ) : (
                // ATS Logic
                <div className="space-y-3">
                  <Link 
                    href={`/jobs/${job.id}/apply`}
                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center block text-center"
                  >
                    Откликнуться
                  </Link>
                  <p className="text-xs text-center text-gray-500">
                    Требуется заполнить короткую анкету
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
