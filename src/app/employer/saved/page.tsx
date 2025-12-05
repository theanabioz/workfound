import Link from 'next/link';
import { getSavedResumes, getCurrentUser } from '@/lib/supabase-service';
import { ArrowLeft, Bookmark, User, Mail } from 'lucide-react';
import { SaveButton } from '@/components/SaveButton';

export default async function SavedCandidatesPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'employer') {
    return <div className="p-8">Доступ запрещен.</div>;
  }

  const resumes = await getSavedResumes();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/employer/dashboard" className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Избранные кандидаты</h1>
            <p className="text-gray-500">Ваш кадровый резерв</p>
          </div>
        </div>

        {/* List */}
        {resumes.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center border border-gray-200 border-dashed">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Список пуст</h3>
            <p className="text-gray-500 mt-2 mb-6">
              Ищите резюме и добавляйте их в избранное, чтобы вернуться к ним позже.
            </p>
            <Link href="/employer/search" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Найти кандидатов
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
                
                <div className="absolute top-4 right-4">
                  <SaveButton itemId={resume.id} itemType="resume" initialSaved={true} />
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500">
                    {resume.fullName?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{resume.fullName || 'Кандидат'}</h3>
                    <p className="text-blue-600 font-medium">{resume.title}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">О себе</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{resume.about}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Навыки</p>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.split(',').slice(0, 4).map((skill, i) => (
                        <span key={i} className="bg-gray-50 px-2 py-1 rounded text-xs text-gray-600 border border-gray-100">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                  <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                    <Mail className="w-4 h-4" />
                    Предложить работу
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
