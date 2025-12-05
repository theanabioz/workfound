'use server';

import { createClient } from '@/utils/supabase/server';
import { Job, Application, Resume, UserProfile, JobQuestion, QuestionAnswer } from '@/types';
import { redirect } from 'next/navigation';

// --- JOBS ---

export async function getJobs(query?: string): Promise<Job[]> {
  const supabase = await createClient();
  
  let queryBuilder = supabase
    .from('jobs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (query) {
    queryBuilder = queryBuilder.ilike('title', `%${query}%`);
  }
  
  const { data, error } = await queryBuilder;

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return data.map(mapJobFromDB);
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const supabase = await createClient();
  
  // Загружаем вакансию + вопросы
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      questions:job_questions(*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) return undefined;

  const job = mapJobFromDB(data);
  
  // Маппим вопросы
  if (data.questions) {
    job.questions = data.questions.map((q: any) => ({
      id: q.id,
      jobId: q.job_id,
      questionText: q.question_text,
      correctAnswer: q.correct_answer,
      isDisqualifying: q.is_disqualifying
    }));
  }

  return job;
}

export async function getEmployerJobs(employerId: string): Promise<Job[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('employer_id', employerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data.map(mapJobFromDB);
}

export async function createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // 1. Создаем вакансию
  const dbJob = {
    employer_id: user.id,
    title: jobData.title,
    description: jobData.description,
    location: jobData.location,
    salary_range: jobData.salaryRange,
    application_method: jobData.applicationMethod,
    contact_info: jobData.contactInfo,
    status: jobData.status || 'published'
  };

  const { data: savedJob, error } = await supabase
    .from('jobs')
    .insert(dbJob)
    .select()
    .single();

  if (error) throw error;

  // 2. Если есть вопросы -> сохраняем их
  if (jobData.questions && jobData.questions.length > 0) {
    const questionsToInsert = jobData.questions.map(q => ({
      job_id: savedJob.id,
      question_text: q.questionText,
      correct_answer: q.correctAnswer,
      is_disqualifying: q.isDisqualifying
    }));

    const { error: qError } = await supabase
      .from('job_questions')
      .insert(questionsToInsert);
      
    if (qError) console.error('Error saving questions:', qError);
  }

  return mapJobFromDB(savedJob);
}

export async function getJobQuestions(jobId: string): Promise<JobQuestion[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('job_questions')
    .select('*')
    .eq('job_id', jobId);

  if (error) return [];

  return data.map((q: any) => ({
    id: q.id,
    jobId: q.job_id,
    questionText: q.question_text,
    correctAnswer: q.correct_answer,
    isDisqualifying: q.is_disqualifying
  }));
}

// --- USERS ---

export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role as any,
    fullName: profile.full_name,
    companyName: profile.company_name,
    phone: profile.phone,
    createdAt: profile.created_at
  };
}

export async function updateProfile(data: Partial<UserProfile>): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const updates = {
    full_name: data.fullName,
    company_name: data.companyName,
    phone: data.phone,
  };

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) throw error;
}

// --- RESUMES ---

export async function getResumes(userId: string): Promise<Resume[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];

  return data.map(mapResumeFromDB);
}

export async function getMyResumes(): Promise<Resume[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  return getResumes(user.id);
}

export async function createResume(resumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resume> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbResume = {
    user_id: user.id,
    title: resumeData.title,
    about: resumeData.about,
    skills: resumeData.skills,
    experience: resumeData.experience,
    is_public: resumeData.isPublic
  };

  const { data, error } = await supabase
    .from('resumes')
    .insert(dbResume)
    .select()
    .single();

  if (error) throw error;
  return mapResumeFromDB(data);
}

export async function searchResumes(query: string): Promise<Resume[]> {
  const supabase = await createClient();
  
  // Ищем только публичные резюме
  let queryBuilder = supabase
    .from('resumes')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (query) {
    // Простой поиск: или в названии, или в навыках
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,skills.ilike.%${query}%`);
  }
  
  const { data, error } = await queryBuilder;

  if (error) return [];
  return data.map(mapResumeFromDB);
}

// --- APPLICATIONS ---

export async function submitApplication(appData: Omit<Application, 'id' | 'status' | 'createdAt'>): Promise<Application> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // 1. Логика Авто-Отказа (Screening)
  let status = 'new';
  
  // Загружаем правильные ответы для этой вакансии
  const { data: questions } = await supabase
    .from('job_questions')
    .select('*')
    .eq('job_id', appData.jobId);

  if (questions && appData.answers) {
    for (const q of questions) {
      if (q.is_disqualifying && q.correct_answer) {
        const userAnswer = appData.answers.find(a => a.questionId === q.id)?.answerText;
        // Если ответ не совпадает -> REJECT
        if (userAnswer !== q.correct_answer) {
          status = 'rejected';
          console.log(`Auto-rejecting application because answer to "${q.question_text}" was "${userAnswer}" (expected "${q.correct_answer}")`);
          break; 
        }
      }
    }
  }

  // 2. Создаем отклик
  const dbApp = {
    job_id: appData.jobId,
    seeker_id: user.id,
    resume_id: appData.resumeId,
    cover_letter: appData.coverLetter,
    resume_url: appData.resumeUrl,
    status: status // Используем вычисленный статус
  };

  const { data: savedApp, error } = await supabase
    .from('applications')
    .insert(dbApp)
    .select()
    .single();

  if (error) throw error;

  // 3. Сохраняем ответы
  if (appData.answers && appData.answers.length > 0) {
    const answersToInsert = appData.answers.map(a => ({
      application_id: savedApp.id,
      question_id: a.questionId,
      answer_text: a.answerText
    }));
    
    await supabase.from('application_answers').insert(answersToInsert);
  }

  return mapApplicationFromDB(savedApp);
}

export async function getEmployerApplications(employerId: string): Promise<(Application & { jobTitle: string; resume?: Resume })[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      jobs ( title, employer_id ),
      resumes ( * )
    `)
    .eq('jobs.employer_id', employerId); 

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    jobId: item.job_id,
    seekerId: item.seeker_id,
    status: item.status,
    resumeId: item.resume_id,
    resumeUrl: item.resume_url,
    coverLetter: item.cover_letter,
    createdAt: item.created_at,
    
    jobTitle: item.jobs?.title || 'Unknown',
    resume: item.resumes ? mapResumeFromDB(item.resumes) : undefined
  }));
}

export async function getSeekerApplications(seekerId: string): Promise<(Application & { job: Job })[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      jobs ( * )
    `)
    .eq('seeker_id', seekerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    jobId: item.job_id,
    seekerId: item.seeker_id,
    status: item.status,
    resumeId: item.resume_id,
    resumeUrl: item.resume_url,
    coverLetter: item.cover_letter,
    createdAt: item.created_at,
    
    job: mapJobFromDB(item.jobs)
  }));
}

export async function updateApplicationStatus(appId: string, status: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', appId);

  if (error) throw error;
}

// --- NOTES ---

export interface Note {
  id: string;
  applicationId: string;
  authorId: string;
  content: string;
  createdAt: string;
  author?: { fullName: string };
}

export async function getNotes(applicationId: string): Promise<Note[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('application_notes')
    .select(`
      *,
      author:profiles(full_name)
    `)
    .eq('application_id', applicationId)
    .order('created_at', { ascending: true });

  if (error) return [];

  return data.map((item: any) => ({
    id: item.id,
    applicationId: item.application_id,
    authorId: item.author_id,
    content: item.content,
    createdAt: item.created_at,
    author: { fullName: item.author?.full_name || 'Unknown' }
  }));
}

export async function addNote(applicationId: string, content: string): Promise<Note> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('application_notes')
    .insert({
      application_id: applicationId,
      author_id: user.id,
      content
    })
    .select(`*, author:profiles(full_name)`)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    applicationId: data.application_id,
    authorId: data.author_id,
    content: data.content,
    createdAt: data.created_at,
    author: { fullName: data.author?.full_name }
  };
}

export async function deleteNote(noteId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('application_notes')
    .delete()
    .eq('id', noteId);
  
  if (error) throw error;
}

// --- SAVED ITEMS ---

export async function toggleSavedItem(itemId: string, type: 'job' | 'resume'): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: existing } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .eq('item_type', type)
    .single();

  if (existing) {
    await supabase.from('saved_items').delete().eq('id', existing.id);
    return false;
  } else {
    await supabase.from('saved_items').insert({
      user_id: user.id,
      item_id: itemId,
      item_type: type
    });
    return true;
  }
}

export async function checkIsSaved(itemId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('saved_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .single();

  return !!data;
}

export async function getSavedJobIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('saved_items')
    .select('item_id')
    .eq('user_id', user.id)
    .eq('item_type', 'job');

  return (data || []).map(i => i.item_id);
}

export async function getSavedResumeIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('saved_items')
    .select('item_id')
    .eq('user_id', user.id)
    .eq('item_type', 'resume');

  return (data || []).map(i => i.item_id);
}

export async function getSavedJobs(): Promise<Job[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: savedItems } = await supabase
    .from('saved_items')
    .select('item_id')
    .eq('user_id', user.id)
    .eq('item_type', 'job');

  if (!savedItems || savedItems.length === 0) return [];

  const jobIds = savedItems.map(i => i.item_id);

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .in('id', jobIds);

  return (jobs || []).map(mapJobFromDB);
}

export async function getSavedResumes(): Promise<Resume[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: savedItems } = await supabase
    .from('saved_items')
    .select('item_id')
    .eq('user_id', user.id)
    .eq('item_type', 'resume');

  if (!savedItems || savedItems.length === 0) return [];

  const resumeIds = savedItems.map(i => i.item_id);

  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    .in('id', resumeIds);

  return (resumes || []).map(mapResumeFromDB);
}

// --- CALENDAR EVENTS ---

export interface CalendarEvent {
  id: string;
  employerId: string;
  applicationId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  eventType: 'interview' | 'call' | 'task';
  candidateName?: string; // Для отображения в UI
}

export async function getEvents(): Promise<CalendarEvent[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('calendar_events')
    .select(`
      *,
      application:applications(
        seeker:profiles(full_name)
      )
    `)
    .eq('employer_id', user.id)
    .order('start_time', { ascending: true });

  if (error) return [];

  return data.map((item: any) => ({
    id: item.id,
    employerId: item.employer_id,
    applicationId: item.application_id,
    title: item.title,
    description: item.description,
    startTime: item.start_time,
    endTime: item.end_time,
    eventType: item.event_type,
    candidateName: item.application?.seeker?.full_name
  }));
}

export async function createEvent(eventData: Omit<CalendarEvent, 'id' | 'employerId' | 'candidateName'>): Promise<CalendarEvent> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbEvent = {
    employer_id: user.id,
    application_id: eventData.applicationId,
    title: eventData.title,
    description: eventData.description,
    start_time: eventData.startTime,
    end_time: eventData.endTime,
    event_type: eventData.eventType
  };

  const { data, error } = await supabase
    .from('calendar_events')
    .insert(dbEvent)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    employerId: data.employer_id,
    applicationId: data.application_id,
    title: data.title,
    description: data.description,
    startTime: data.start_time,
    endTime: data.end_time,
    eventType: data.event_type
  };
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// --- MAPPERS ---

function mapJobFromDB(dbJob: any): Job {
  return {
    id: dbJob.id,
    employerId: dbJob.employer_id,
    title: dbJob.title,
    description: dbJob.description,
    location: dbJob.location,
    salaryRange: dbJob.salary_range,
    applicationMethod: dbJob.application_method,
    contactInfo: dbJob.contact_info,
    status: dbJob.status,
    createdAt: dbJob.created_at,
    updatedAt: dbJob.updated_at
  };
}

function mapResumeFromDB(dbResume: any): Resume {
  return {
    id: dbResume.id,
    userId: dbResume.user_id,
    title: dbResume.title,
    about: dbResume.about,
    skills: dbResume.skills,
    experience: dbResume.experience,
    isPublic: dbResume.is_public,
    createdAt: dbResume.created_at,
    updatedAt: dbResume.updated_at
  };
}

function mapApplicationFromDB(dbApp: any): Application {
  return {
    id: dbApp.id,
    jobId: dbApp.job_id,
    seekerId: dbApp.seeker_id,
    status: dbApp.status,
    resumeId: dbApp.resume_id,
    resumeUrl: dbApp.resume_url,
    coverLetter: dbApp.cover_letter,
    createdAt: dbApp.created_at
  };
}
