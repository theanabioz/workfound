'use client';

import JobCard from '@/components/jobs/JobCard';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([
    {
      id: "1",
      title: "Водитель-дальнобойщик категории CE",
      company: "TransLogistics GmbH",
      location: "Германия, Мюнхен",
      salary: "€2,500 - €3,000",
      tags: ['Жилье предоставляется', 'Официальное трудоустройство'],
      postedAt: "2 часа назад",
      isPremium: true
    },
    {
      id: "3",
      title: "Сварщик MIG/MAG",
      company: "MetalWorks s.r.o.",
      location: "Чехия, Прага",
      salary: "€2,000 - €2,400",
      tags: ['Бесплатное проживание', 'Спецодежда'],
      postedAt: "1 день назад"
    },
    {
      id: "4",
      title: "Монтажник солнечных панелей",
      company: "EcoEnergy B.V.",
      location: "Нидерланды, Амстердам",
      salary: "€2,200 - €2,800",
      tags: ['Обучение', 'Транспорт до работы'],
      postedAt: "1 день назад"
    }
  ]);

  const removeJob = (id: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Сохраненные вакансии</h1>
          <p className="text-sm text-slate-500 mt-1">Вакансии, которые вы добавили в избранное</p>
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">У вас нет сохраненных вакансий.</p>
          <a href="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">Перейти к поиску вакансий</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedJobs.map((job) => (
            <div key={job.id} className="relative group">
              <JobCard {...job} />
              <button 
                onClick={() => removeJob(job.id)}
                className="absolute top-4 right-4 p-2 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                title="Удалить из сохраненных"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
