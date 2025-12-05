import Link from 'next/link';
import { getMyResumes } from '@/lib/supabase-service';
import { FileText, Plus, ArrowLeft, Calendar } from 'lucide-react';

export default async function ResumesPage() {
  const resumes = await getMyResumes();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/seeker/dashboard" className="p-2 hover:bg-white rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Мои резюме</h1>
              <p className="text-gray-500">Управляйте разными профилями для разных работ</p>
            </div>
          </div>
          <Link 
            href="/seeker/resumes/new"
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Создать резюме
          </Link>
        </div>

        {/* List */}
        {resumes.length === 0 ? (
          <div className="bg-white p-12 rounded-lg text-center border border-gray-200 border-dashed">
             <p className="text-gray-500 mb-4">У вас пока нет ни одного резюме.</p>
             <Link 
                href="/seeker/resumes/new"
                className="text-blue-600 font-medium hover:underline"
             >
                Создать первое резюме
             </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-black transition-all cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      {resume.title}
                      {resume.isPublic && (
                        <span className="text-[10px] uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold tracking-wide">
                          Видно всем
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{resume.about}</p>
                    
                    <div className="mt-4 flex gap-2">
                      {resume.skills.split(',').slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
