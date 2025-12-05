'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Plus, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { submitApplication, getMyResumes, getJobQuestions } from '@/lib/supabase-service';
import { Resume, JobQuestion, QuestionAnswer } from '@/types';

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Data State
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [questions, setQuestions] = useState<JobQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> answer ('yes'/'no')

  // Load Data
  useEffect(() => {
    const load = async () => {
      if (typeof params.id !== 'string') return;
      
      try {
        const [resumesData, questionsData] = await Promise.all([
          getMyResumes(),
          getJobQuestions(params.id)
        ]);
        
        setResumes(resumesData);
        setQuestions(questionsData);
        
        if (resumesData.length > 0) {
          setSelectedResumeId(resumesData[0].id);
        }
        
        // Initialize answers
        const initialAnswers: Record<string, string> = {};
        questionsData.forEach(q => {
          initialAnswers[q.id!] = 'yes'; // Default to Yes
        });
        setAnswers(initialAnswers);

      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [params.id]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedResumeId) {
      alert('Пожалуйста, выберите резюме');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format answers for API
      const formattedAnswers: QuestionAnswer[] = Object.entries(answers).map(([qId, val]) => ({
        questionId: qId,
        answerText: val
      }));

      if (typeof params.id === 'string') {
        await submitApplication({
          jobId: params.id,
          seekerId: '', 
          resumeId: selectedResumeId,
          coverLetter: coverLetter,
          answers: formattedAnswers
        });
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      alert('Произошла ошибка при отправке.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Отклик отправлен!</h2>
          <p className="text-gray-600 mb-6">
            Работодатель рассмотрит вашу заявку.
          </p>
          <Link 
            href="/"
            className="block w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Вернуться к вакансиям
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="p-12 text-center">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link href={`/jobs/${params.id}`} className="inline-flex items-center text-gray-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к вакансии
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Отклик на вакансию</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. SCREENING QUESTIONS */}
            {questions.length > 0 && (
              <div className="space-y-4 pb-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> Вопросы от работодателя
                </h3>
                <div className="space-y-4">
                  {questions.map(q => (
                    <div key={q.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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

            {/* 2. RESUME SELECTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Выберите резюме</label>
              
              {resumes.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                  <p className="text-yellow-800 text-sm mb-2">У вас пока нет созданных резюме.</p>
                  <Link href="/seeker/resumes/new" className="text-black font-medium underline text-sm">
                    Создать резюме сейчас
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div 
                      key={resume.id}
                      onClick={() => setSelectedResumeId(resume.id)}
                      className={`cursor-pointer border rounded-lg p-4 flex items-start gap-3 transition-all ${
                        selectedResumeId === resume.id 
                          ? 'border-black bg-gray-50 ring-1 ring-black' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedResumeId === resume.id ? 'border-black' : 'border-gray-300'
                      }`}>
                        {selectedResumeId === resume.id && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{resume.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{resume.about}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Link href="/seeker/resumes/new" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black mt-2">
                    <Plus className="w-3 h-3" />
                    Создать новое резюме
                  </Link>
                </div>
              )}
            </div>

            {/* 3. COVER LETTER */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Сопроводительное письмо</label>
              <textarea 
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                placeholder="Почему вы подходите на эту роль?"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || resumes.length === 0}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Отправка...' : 'Отправить отклик'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}