'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createResume } from '@/lib/supabase-service'; // Это Server Action
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewResumePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createResume({
        // userId берется из сессии
        title,
        about,
        skills,
        experience,
        isPublic: true,
      });
      router.push('/seeker/resumes');
    } catch (error) {
      console.error(error);
      alert('Ошибка при создании резюме');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/seeker/resumes" className="inline-flex items-center text-gray-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к списку
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Новое резюме</h1>
          <p className="text-gray-500 mb-8">Создайте профиль под конкретную профессию.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название резюме (для вас)</label>
              <input 
                type="text" 
                required
                placeholder="Например: Водитель-международник"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">О себе / Summary</label>
              <textarea 
                rows={3}
                required
                placeholder="Кратко о ваших сильных сторонах..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Навыки (через запятую)</label>
              <input 
                type="text" 
                placeholder="Вождение, Ремонт, Английский B1"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Опыт работы</label>
              <textarea 
                rows={5}
                placeholder="Опишите последние места работы..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Сохранение...' : 'Создать резюме'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
