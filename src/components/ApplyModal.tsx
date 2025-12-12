'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, Plus, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { submitApplication, getMyResumes, getJobQuestions } from '@/lib/supabase-service';
import { Resume, JobQuestion, QuestionAnswer } from '@/types';

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

  // Form State
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Load Data
  useEffect(() => {
    const load = async () => {
      try {
        const [resumesData, questionsData] = await Promise.all([
          getMyResumes(),
          getJobQuestions(jobId)
        ]);
        
        setResumes(resumesData);
        setQuestions(questionsData);
        
        if (resumesData.length > 0) {
          setSelectedResumeId(resumesData[0].id);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId) return alert('Выберите резюме');

    setIsSubmitting(true);

    try {
      const formattedAnswers: QuestionAnswer[] = Object.entries(answers).map(([qId, val]) => ({
        questionId: qId,
        answerText: val
      }));

      await submitApplication({
        jobId,
        seekerId: '', 
        resumeId: selectedResumeId,
        coverLetter,
        answers: formattedAnswers
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Ошибка при отправке. Вы вошли в аккаунт?');
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

              {/* RESUME */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Выберите резюме</label>
                
                {resumes.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center">
                    <p className="text-yellow-800 text-sm mb-2">У вас пока нет резюме.</p>
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
                    
                    <Link href="/seeker/resumes/new" className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black mt-2">
                      <Plus className="w-3 h-3" /> Создать новое резюме
                    </Link>
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
            disabled={isSubmitting || resumes.length === 0}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-lg shadow-gray-200"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить отклик'}
          </button>
        </div>

      </div>
    </div>
  );
}
