import { searchResumes, getCurrentUser, getSavedResumeIds } from '@/lib/supabase-service';
import { Search, User, Briefcase, Mail } from 'lucide-react';
import { SaveButton } from '@/components/SaveButton';

export default async function ResumeSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'employer') {
    return <div className="p-8">Доступ запрещен.</div>;
  }

  const params = await searchParams;
  const query = params.q || '';
  
  const [resumes, savedIds] = await Promise.all([
    searchResumes(query),
    getSavedResumeIds()
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Поиск кандидатов</h1>
          <p className="text-gray-500">Найдите лучших специалистов в нашей базе.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8">
          <form action="/employer/search" method="GET" className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input 
              type="text" 
              name="q"
              defaultValue={query}
              placeholder="Кого вы ищете? (например, Водитель, Java Developer)"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-black outline-none"
            />
          </form>
        </div>

        {/* Results */}
        {resumes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Никого не найдено</h3>
            <p className="text-gray-500">Попробуйте изменить запрос.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative">
                
                <div className="absolute top-4 right-4">
                  <SaveButton itemId={resume.id} itemType="resume" initialSaved={savedIds.includes(resume.id)} />
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
