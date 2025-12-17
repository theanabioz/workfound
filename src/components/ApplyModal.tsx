'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, Plus, HelpCircle, Upload, FileText, Loader2, User } from 'lucide-react';
import Link from 'next/link';
import { submitApplication, getMyResumes, getJobQuestions } from '@/lib/supabase-service';
import { Resume, JobQuestion, QuestionAnswer } from '@/types';
import { uploadResume } from '@/utils/upload';
import { createClient } from '@/utils/supabase/client';

interface ApplyModalProps {
  jobId: string;
  jobTitle: string;
  onClose: () => void;
}

export function ApplyModal({ jobId, jobTitle, onClose }: ApplyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Data State
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [questions, setQuestions] = useState<JobQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Form State
  const [coverLetter, setCoverLetter] = useState('');
  const [applyMethod, setApplyMethod] = useState<'profile' | 'file'>('profile');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Load Data
  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUserId(user.id);

        const [resumesData, questionsData] = await Promise.all([
          getMyResumes(),
          getJobQuestions(jobId)
        ]);
        
        setResumes(resumesData);
        setQuestions(questionsData);
        
        if (resumesData.length > 0) {
          setSelectedResumeId(resumesData[0].id);
        } else {
          setApplyMethod('file'); // Если профилей нет, переключаем на файл по умолчанию
        }
        
        const initialAnswers: Record<string, string> = {};
        questionsData.forEach(q => {
          initialAnswers[q.id!] = 'yes';
        });
        setAnswers(initialAnswers);

      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [jobId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (applyMethod === 'profile' && !selectedResumeId) return alert('Выберите резюме из списка');
    if (applyMethod === 'file' && !uploadedFile) return alert('Загрузите файл резюме');

    setIsSubmitting(true);

    try {
      const formattedAnswers: QuestionAnswer[] = Object.entries(answers).map(([qId, val]) => ({
        questionId: qId,
        answerText: val
      }));

      let resumeUrl = '';
      let resumeIdToSave = undefined;

      if (applyMethod === 'file' && uploadedFile && currentUserId) {
        // Upload File
        const path = await uploadResume(uploadedFile, currentUserId);
        // Получаем публичную ссылку (или храним путь).
        // В нашем случае, бакет resumes приватный. Мы храним путь.
        resumeUrl = path; 
      } else {
        resumeIdToSave = selectedResumeId;
      }

      await submitApplication({
        jobId,
        seekerId: '', 
        resumeId: resumeIdToSave,
        resumeUrl: resumeUrl, // Save path if file uploaded
        coverLetter,
        answers: formattedAnswers
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Ошибка при отправке.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center animate-in zoom-in-95">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Отклик отправлен!</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Работодатель получил ваше резюме.
          </p>
          <button 
            onClick={onClose}
            className="block w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Отклик на вакансию</h2>
            <p className="text-sm text-gray-500 truncate max-w-[250px]">{jobTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400">Загрузка данных...</div>
          ) : (
            <form id="apply-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* QUESTIONS */}
              {questions.length > 0 && (
                <div className="space-y-4 pb-6 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <HelpCircle className="w-4 h-4" /> Вопросы от работодателя
                  </h3>
                  <div className="space-y-4">
                    {questions.map(q => (
                      <div key={q.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-sm font-medium text-gray-900 mb-3">{q.questionText}</p>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name={`q-${q.id}`} 
                              value="yes"
                              checked={answers[q.id!] === 'yes'}
                              onChange={() => handleAnswerChange(q.id!, 'yes')}
                              className="text-black focus:ring-black"
                            />
                            <span className="text-sm">Да</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name={`q-${q.id}`} 
                              value="no"
                              checked={answers[q.id!] === 'no'}
                              onChange={() => handleAnswerChange(q.id!, 'no')}
                              className="text-black focus:ring-black"
                            />
                            <span className="text-sm">Нет</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RESUME SELECTION TYPE */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Резюме</label>
                
                <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => setApplyMethod('profile')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                      applyMethod === 'profile' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    <User className="w-4 h-4" /> Профиль
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplyMethod('file')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                      applyMethod === 'file' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    <Upload className="w-4 h-4" /> Загрузить файл
                  </button>
                </div>

                {applyMethod === 'profile' ? (
                  resumes.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center">
                      <p className="text-yellow-800 text-sm mb-2">У вас пока нет профилей.</p>
                      <Link href="/seeker/resumes/new" className="text-black font-bold underline text-sm">
                        Создать сейчас
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resumes.map((resume) => (
                        <div 
                          key={resume.id}
                          onClick={() => setSelectedResumeId(resume.id)}
                          className={`cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all ${
                            selectedResumeId === resume.id 
                              ? 'border-black bg-gray-50 ring-1 ring-black' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedResumeId === resume.id ? 'border-black' : 'border-gray-300'
                          }`}>
                            {selectedResumeId === resume.id && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{resume.title}</h3>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{resume.about}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {uploadedFile ? <FileText className="w-6 h-6 text-black" /> : <Upload className="w-6 h-6 text-gray-400" />}
                      </div>
                      {uploadedFile ? (
                        <div>
                          <p className="text-sm font-bold text-gray-900">{uploadedFile.name}</p>
                          <p className="text-xs text-green-600">Готов к отправке</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Нажмите, чтобы выбрать файл</p>
                          <p className="text-xs text-gray-400 mt-1">PDF, DOCX до 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* COVER LETTER */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Сопроводительное письмо</label>
                <textarea 
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-black focus:ring-black bg-gray-50 focus:bg-white transition-colors resize-none"
                  placeholder="Почему вы подходите?"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <button
            form="apply-form"
            type="submit"
            disabled={isSubmitting || (applyMethod === 'profile' && resumes.length === 0) || (applyMethod === 'file' && !uploadedFile)}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Отправка...' : 'Отправить отклик'}
          </button>
        </div>

      </div>
    </div>
  );
}