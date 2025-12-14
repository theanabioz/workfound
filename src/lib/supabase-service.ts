'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { Job, Application, Resume, UserProfile, JobQuestion, QuestionAnswer, Company, CompanyMember, CalendarEvent } from '@/types';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const COUNTRY_MAP: Record<string, string> = {
  'de': 'Германия',
  'pl': 'Польша',
  'lt': 'Литва',
  'nl': 'Нидерланды',
  'ee': 'Эстония',
  'cz': 'Чехия'
};

// --- HELPER: Alerts ---
async function checkAndSendAlerts(job: Job) {
  console.log(`[ALERTS] Checking alerts for job: "${job.title}" in "${job.location}"`);
  const supabase = createAdminClient();
  
  const { data: allAlerts } = await supabase
    .from('job_alerts')
    .select('*, profiles(email)');

  if (!allAlerts) return;

  const matchingAlerts = allAlerts.filter((alert: any) => {
    const keywordMatch = 
      (alert.keywords && job.title.toLowerCase().includes(alert.keywords.toLowerCase())) || 
      (alert.keywords && alert.keywords.toLowerCase().includes(job.title.toLowerCase()));
    
    const locationMatch = 
      !alert.location || 
      job.location.toLowerCase().includes(alert.location.toLowerCase());

    return keywordMatch && locationMatch;
  });

  console.log(`[ALERTS] Found ${matchingAlerts.length} matches.`);

  for (const alert of matchingAlerts) {
    const email = alert.profiles?.email;
    if (!email) continue;

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: `Новая вакансия: ${job.title}`,
        html: `
          <h1>Найдена новая вакансия!</h1>
          <p>По вашему запросу <strong>"${alert.keywords}"</strong> появилась новая позиция:</p>
          <div style="border: 1px solid #eee; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>${job.title}</h2>
            <p><strong>Локация:</strong> ${job.location}</p>
            <p><strong>Зарплата:</strong> ${job.salaryRange}</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/jobs/${job.id}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Посмотреть вакансию</a>
          </div>
        `
      });
    } catch (error) {
      console.error('[ALERTS] Error:', error);
    }
  }
}

// --- COMPANIES ---

export async function getCurrentCompany(): Promise<Company | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: members, error } = await supabase
    .from('company_members')
    .select('company_id, companies(*)')
    .eq('user_id', user.id);

  if (error || !members || members.length === 0) return null;

  const member = members[0];
  if (!member.companies) return null;

  const c = member.companies as any;
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    logoUrl: c.logo_url,
    website: c.website,
    description: c.description,
    createdAt: c.created_at
  };
}

export async function updateCompany(data: Partial<Company>): Promise<void> {
  const supabase = await createClient();
  const company = await getCurrentCompany();
  if (!company) throw new Error('No company found');

  const updates: any = {
    name: data.name,
    slug: data.slug,
    website: data.website,
    description: data.description
  };
  if (data.logoUrl) updates.logo_url = data.logoUrl;

  const { error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', company.id);

  if (error) throw error;
}

export async function getCompanyMembers(): Promise<CompanyMember[]> {
  const supabase = await createClient();
  const company = await getCurrentCompany();
  if (!company) return [];

  const { data, error } = await supabase
    .from('company_members')
    .select(`*, profiles(*)`)
    .eq('company_id', company.id);

  if (error) return [];

  return data.map((m: any) => ({
    id: m.id,
    companyId: m.company_id,
    userId: m.user_id,
    role: m.role,
    profile: m.profiles ? {
      id: m.profiles.id,
      email: m.profiles.email,
      role: m.profiles.role,
      fullName: m.profiles.full_name,
      companyName: m.profiles.company_name,
      phone: m.profiles.phone,
      createdAt: m.profiles.created_at
    } : undefined
  }));
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('companies').select('*').eq('slug', slug).single();
  if (error || !data) return null;
  return { id: data.id, name: data.name, slug: data.slug, logoUrl: data.logo_url, website: data.website, description: data.description, createdAt: data.created_at };
}

export async function getCompanyJobsPublic(companyId: string): Promise<Job[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('jobs').select('*').eq('company_id', companyId).eq('status', 'published').order('created_at', { ascending: false });
  if (error) return [];
  return data.map(mapJobFromDB);
}

// --- JOBS ---

export interface JobFilters {
  query?: string;
  country?: string;
  city?: string;
  minSalary?: number;
  salaryPeriod?: 'hour' | 'month';
  benefits?: string[];
}

export async function getJobs(filters: JobFilters | string = {}): Promise<Job[]> {
  const supabase = await createClient();
  
  const actualFilters = typeof filters === 'string' ? { query: filters } : filters;

  let queryBuilder = supabase
    .from('jobs')
    .select('*')
    .eq('status', 'published')
    // Сначала продвинутые (у кого дата в будущем), потом обычные
    // NULLS LAST важен, чтобы непродвинутые были внизу
    .order('promoted_until', { ascending: false, nullsFirst: false }) 
    .order('created_at', { ascending: false });

  if (actualFilters.query) {
    queryBuilder = queryBuilder.ilike('title', `%${actualFilters.query}%`);
  }
  
  if (actualFilters.country && actualFilters.country !== 'Все страны' && actualFilters.country !== 'all') {
    const countryName = COUNTRY_MAP[actualFilters.country] || actualFilters.country;
    queryBuilder = queryBuilder.eq('country', countryName);
  }

  if (actualFilters.city) {
    queryBuilder = queryBuilder.ilike('city', `%${actualFilters.city}%`);
  }

  if (actualFilters.minSalary) {
    queryBuilder = queryBuilder.gte('salary_min', actualFilters.minSalary);
  }

  if (actualFilters.salaryPeriod) {
    queryBuilder = queryBuilder.eq('salary_period', actualFilters.salaryPeriod);
  }

  if (actualFilters.benefits && actualFilters.benefits.length > 0) {
    queryBuilder = queryBuilder.contains('benefits', actualFilters.benefits);
  }
  
  const { data, error } = await queryBuilder;

  if (error) {
    console.error('Error fetching jobs:', JSON.stringify(error, null, 2));
    return [];
  }

  return data.map(mapJobFromDB);
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      questions:job_questions(*),
      companies(*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) return undefined;

  const job = mapJobFromDB(data);
  
  if (data.companies) {
    // Временно добавим данные компании в объект job (нужно обновить тип Job, но можно хаком)
    (job as any).company = {
      id: data.companies.id,
      name: data.companies.name,
      logoUrl: data.companies.logo_url,
      slug: data.companies.slug,
      website: data.companies.website,
      description: data.companies.description
    };
  }
  
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

export async function getEmployerJobs(userId: string): Promise<Job[]> {
  const supabase = await createClient();
  const company = await getCurrentCompany();
  let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });
  if (company) {
    query = query.eq('company_id', company.id);
  } else {
    query = query.eq('employer_id', userId);
  }
  const { data, error } = await query;
  if (error) { console.error(error); return []; }
  return data.map(mapJobFromDB);
}

export async function createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const company = await getCurrentCompany();

  // Auto-generate salary range if user didn't provide text but provided numbers
  let displaySalary = jobData.salaryRange;
  if (!displaySalary && jobData.salaryMin) {
    displaySalary = `${jobData.salaryMin}`;
    if (jobData.salaryMax) displaySalary += ` - ${jobData.salaryMax}`;
  }

  const dbJob = {
    employer_id: user.id,
    company_id: company?.id,
    title: jobData.title,
    description: jobData.description,
    location: jobData.location,
    country: jobData.country,
    city: jobData.city,
    salary_range: displaySalary || jobData.salaryRange, // Use auto or manual
    salary_min: jobData.salaryMin,
    salary_max: jobData.salaryMax,
    salary_period: jobData.salaryPeriod || 'month',
    benefits: jobData.benefits,
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

  if (jobData.questions && jobData.questions.length > 0) {
    const questionsToInsert = jobData.questions.map(q => ({
      job_id: savedJob.id,
      question_text: q.questionText,
      correct_answer: q.correctAnswer,
      is_disqualifying: q.isDisqualifying
    }));
    await supabase.from('job_questions').insert(questionsToInsert);
  }

  const finalJob = mapJobFromDB(savedJob);
  await checkAndSendAlerts(finalJob);

  return finalJob;
}

export async function promoteJob(jobId: string, planId: string): Promise<void> {
  const supabase = await createClient(); // Need admin client to update jobs? No, employer can update own jobs
  
  const updates: any = {};
  if (planId === 'highlight') {
    updates.is_highlighted = true;
  } else if (planId === 'top_7') {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    updates.promoted_until = nextWeek.toISOString();
  }

  const { error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId);

  if (error) throw error;
}

export async function getJobQuestions(jobId: string): Promise<JobQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('job_questions').select('*').eq('job_id', jobId);
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
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile) return null;
  return { id: profile.id, email: profile.email, role: profile.role as any, fullName: profile.full_name, companyName: profile.company_name, phone: profile.phone, createdAt: profile.created_at };
}

export async function updateProfile(data: Partial<UserProfile>): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  await supabase.from('profiles').update({ full_name: data.fullName, company_name: data.companyName, phone: data.phone }).eq('id', user.id);
}

// --- RESUMES ---

export async function getResumes(userId: string): Promise<Resume[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('resumes').select('*').eq('user_id', userId).order('created_at', { ascending: false });
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
  const { data, error } = await supabase.from('resumes').insert({ user_id: user.id, title: resumeData.title, about: resumeData.about, skills: resumeData.skills, experience: resumeData.experience, is_public: resumeData.isPublic }).select().single();
  if (error) throw error;
  return mapResumeFromDB(data);
}

export async function searchResumes(query: string): Promise<Resume[]> {
  const supabase = await createClient();
  let q = supabase.from('resumes').select('*').eq('is_public', true).order('created_at', { ascending: false });
  if (query) q = q.or(`title.ilike.%${query}%,skills.ilike.%${query}%`);
  const { data, error } = await q;
  if (error) return [];
  return data.map(mapResumeFromDB);
}

// --- APPLICATIONS ---

export async function submitApplication(appData: Omit<Application, 'id' | 'status' | 'createdAt'>): Promise<Application> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  let status = 'new';
  const { data: questions } = await supabase.from('job_questions').select('*').eq('job_id', appData.jobId);
  if (questions && appData.answers) {
    for (const q of questions) {
      if (q.is_disqualifying && q.correct_answer) {
        const userAnswer = appData.answers.find(a => a.questionId === q.id)?.answerText;
        if (userAnswer !== q.correct_answer) { status = 'rejected'; break; }
      }
    }
  }
  const { data: savedApp, error } = await supabase.from('applications').insert({ job_id: appData.jobId, seeker_id: user.id, resume_id: appData.resumeId, cover_letter: appData.coverLetter, resume_url: appData.resumeUrl, status }).select().single();
  if (error) throw error;
  if (appData.answers && appData.answers.length > 0) {
    await supabase.from('application_answers').insert(appData.answers.map(a => ({ application_id: savedApp.id, question_id: a.questionId, answer_text: a.answerText })));
  }
  return mapApplicationFromDB(savedApp);
}

export async function getEmployerApplications(employerId: string): Promise<(Application & { jobTitle: string; resume?: Resume })[]> {
  const supabase = await createClient();
  const { data: member } = await supabase.from('company_members').select('company_id').eq('user_id', employerId).single();
  if (!member) return [];
  const { data, error } = await supabase.from('applications').select(`*, jobs ( title, employer_id, company_id ), resumes ( * )`).eq('jobs.company_id', member.company_id);
  if (error) return [];
  return data.map((item: any) => ({ id: item.id, jobId: item.job_id, seekerId: item.seeker_id, status: item.status, resumeId: item.resume_id, resumeUrl: item.resume_url, coverLetter: item.cover_letter, createdAt: item.created_at, jobTitle: item.jobs?.title || 'Unknown', resume: item.resumes ? mapResumeFromDB(item.resumes) : undefined }));
}

export async function getSeekerApplications(seekerId: string): Promise<(Application & { job: Job })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('applications').select(`*, jobs ( * )`).eq('seeker_id', seekerId).order('created_at', { ascending: false });
  if (error) return [];
  return data.map((item: any) => ({ id: item.id, jobId: item.job_id, seekerId: item.seeker_id, status: item.status, resumeId: item.resume_id, resumeUrl: item.resume_url, coverLetter: item.cover_letter, createdAt: item.created_at, job: mapJobFromDB(item.jobs) }));
}

export async function updateApplicationStatus(appId: string, status: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from('applications').update({ status }).eq('id', appId);
}

// --- CHAT, CALENDAR, NOTES, SAVED ---

export async function startConversation(otherUserId: string, jobId?: string): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  let employerId = profile?.role === 'employer' ? user.id : otherUserId;
  let seekerId = profile?.role === 'employer' ? otherUserId : user.id;
  const { data: existing } = await supabase.from('conversations').select('id').eq('employer_id', employerId).eq('seeker_id', seekerId).single();
  if (existing) return existing.id;
  const { data: newConv, error } = await supabase.from('conversations').insert({ employer_id: employerId, seeker_id: seekerId, job_id: jobId }).select().single();
  if (error) throw error;
  return newConv.id;
}

export async function getConversations(): Promise<Conversation[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from('conversations').select(`*, employer:profiles!conversations_employer_id_fkey(id, full_name, role), seeker:profiles!conversations_seeker_id_fkey(id, full_name, role), messages(content, created_at)`).or(`employer_id.eq.${user.id},seeker_id.eq.${user.id}`).order('updated_at', { ascending: false });
  if (error) return [];
  return data.map((item: any) => {
    const isMeEmployer = item.employer_id === user.id;
    const other = isMeEmployer ? item.seeker : item.employer;
    const lastMsg = item.messages?.sort((a:any, b:any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    return { id: item.id, employerId: item.employer_id, seekerId: item.seeker_id, jobId: item.job_id, updatedAt: item.updated_at, otherUser: { fullName: other?.full_name || 'Unknown', role: other?.role }, lastMessage: lastMsg?.content };
  });
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
  if (error) return [];
  return data.map((m: any) => ({ id: m.id, conversationId: m.conversation_id, senderId: m.sender_id, content: m.content, isRead: m.is_read, createdAt: m.created_at }));
}

export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: user.id, content }).select().single();
  if (error) throw error;
  await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);
  return { id: data.id, conversationId: data.conversation_id, senderId: data.sender_id, content: data.content, isRead: data.is_read, createdAt: data.created_at };
}

export async function getEvents(): Promise<CalendarEvent[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from('calendar_events').select(`*, application:applications(seeker:profiles(full_name))`).eq('employer_id', user.id).order('start_time', { ascending: true });
  if (error) return [];
  return data.map((item: any) => ({ id: item.id, employerId: item.employer_id, applicationId: item.application_id, title: item.title, description: item.description, startTime: item.start_time, endTime: item.end_time, eventType: item.event_type, candidateName: item.application?.seeker?.full_name }));
}

export async function createEvent(eventData: Omit<CalendarEvent, 'id' | 'employerId' | 'candidateName'>): Promise<CalendarEvent> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const dbEvent = { employer_id: user.id, application_id: eventData.applicationId, title: eventData.title, description: eventData.description, start_time: eventData.startTime, end_time: eventData.endTime, event_type: eventData.eventType };
  const { data, error } = await supabase.from('calendar_events').insert(dbEvent).select().single();
  if (error) throw error;
  return { id: data.id, employerId: data.employer_id, applicationId: data.application_id, title: data.title, description: data.description, startTime: data.start_time, endTime: data.end_time, eventType: data.event_type };
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from('calendar_events').delete().eq('id', id);
}

export async function getNotes(applicationId: string): Promise<Note[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('application_notes').select(`*, author:profiles(full_name)`).eq('application_id', applicationId).order('created_at', { ascending: true });
  if (error) return [];
  return data.map((item: any) => ({ id: item.id, applicationId: item.application_id, authorId: item.author_id, content: item.content, createdAt: item.created_at, author: { fullName: item.author?.full_name || 'Unknown' } }));
}

export async function addNote(applicationId: string, content: string): Promise<Note> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase.from('application_notes').insert({ application_id: applicationId, author_id: user.id, content }).select(`*, author:profiles(full_name)`).single();
  if (error) throw error;
  return { id: data.id, applicationId: data.application_id, authorId: data.author_id, content: data.content, createdAt: data.created_at, author: { fullName: data.author?.full_name } };
}

export async function deleteNote(noteId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from('application_notes').delete().eq('id', noteId);
}

export async function toggleSavedItem(itemId: string, type: 'job' | 'resume'): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: existing } = await supabase.from('saved_items').select('id').eq('user_id', user.id).eq('item_id', itemId).eq('item_type', type).single();
  if (existing) { await supabase.from('saved_items').delete().eq('id', existing.id); return false; }
  else { await supabase.from('saved_items').insert({ user_id: user.id, item_id: itemId, item_type: type }); return true; }
}

export async function checkIsSaved(itemId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from('saved_items').select('id').eq('user_id', user.id).eq('item_id', itemId).single();
  return !!data;
}

export async function getSavedJobIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from('saved_items').select('item_id').eq('user_id', user.id).eq('item_type', 'job');
  return (data || []).map(i => i.item_id);
}

export async function getSavedJobs(): Promise<Job[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: savedItems } = await supabase.from('saved_items').select('item_id').eq('user_id', user.id).eq('item_type', 'job');
  if (!savedItems || savedItems.length === 0) return [];
  const jobIds = savedItems.map(i => i.item_id);
  const { data: jobs } = await supabase.from('jobs').select('*').in('id', jobIds);
  return (jobs || []).map(mapJobFromDB);
}

export async function getSavedResumeIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from('saved_items').select('item_id').eq('user_id', user.id).eq('item_type', 'resume');
  return (data || []).map(i => i.item_id);
}

export async function getSavedResumes(): Promise<Resume[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: savedItems } = await supabase.from('saved_items').select('item_id').eq('user_id', user.id).eq('item_type', 'resume');
  if (!savedItems || savedItems.length === 0) return [];
  const resumeIds = savedItems.map(i => i.item_id);
  const { data: resumes } = await supabase.from('resumes').select('*').in('id', resumeIds);
  return (resumes || []).map(mapResumeFromDB);
}

// --- TEAM & INVITATIONS ---

export interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'recruiter';
  status: string;
  createdAt: string;
  token: string;
}

export async function getInvitations(): Promise<Invitation[]> {
  const supabase = await createClient();
  const company = await getCurrentCompany();
  if (!company) return [];
  const { data, error } = await supabase.from('company_invitations').select('*').eq('company_id', company.id).eq('status', 'pending');
  if (error) return [];
  return data.map((i: any) => ({ id: i.id, email: i.email, role: i.role, status: i.status, createdAt: i.created_at, token: i.token }));
}

export async function inviteMember(email: string, role: 'admin' | 'recruiter'): Promise<void> {
  const supabase = await createClient();
  const company = await getCurrentCompany();
  if (!company) throw new Error('No company');
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const { error } = await supabase.from('company_invitations').insert({ company_id: company.id, email, role, token });
  if (error) throw error;
  try {
    await resend.emails.send({ from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev', to: email, subject: `Приглашение в команду ${company.name}`, html: `<h1>Вас пригласили!</h1><p>Компания <strong>${company.name}</strong> приглашает вас.</p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}">Принять</a>` });
  } catch (e) { console.error(e); }
}

export async function acceptInvitation(token: string): Promise<{ success: boolean; companyName?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };
  const adminSupabase = createAdminClient();
  const { data: invite } = await adminSupabase.from('company_invitations').select('*, companies(name)').eq('token', token).eq('status', 'pending').single();
  if (!invite) return { success: false, error: 'Приглашение не найдено' };
  const { error: memberError } = await adminSupabase.from('company_members').insert({ company_id: invite.company_id, user_id: user.id, role: invite.role });
  if (memberError && !memberError.message.includes('unique constraint')) return { success: false, error: 'Ошибка добавления' };
  await adminSupabase.from('profiles').update({ role: 'employer' }).eq('id', user.id);
  await adminSupabase.from('company_invitations').update({ status: 'accepted' }).eq('id', invite.id);
  return { success: true, companyName: invite.companies?.name };
}

// --- JOB ALERTS ---

export interface JobAlert {
  id: string;
  keywords?: string;
  location?: string;
  frequency: string;
  createdAt: string;
}

export async function createJobAlert(alertData: { keywords?: string; location?: string }): Promise<JobAlert> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase.from('job_alerts').insert({ user_id: user.id, keywords: alertData.keywords, location: alertData.location }).select().single();
  if (error) throw error;
  return { id: data.id, keywords: data.keywords, location: data.location, frequency: data.frequency, createdAt: data.created_at };
}

export async function getJobAlerts(): Promise<JobAlert[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from('job_alerts').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) return [];
  return data.map((a: any) => ({ id: a.id, keywords: a.keywords, location: a.location, frequency: a.frequency, createdAt: a.created_at }));
}

export async function deleteJobAlert(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('job_alerts').delete().eq('id', id);
  if (error) throw error;
}

// --- ADMIN ---

export async function getAdminStats() {
  const supabase = createAdminClient(); 
  const [ { count: usersCount }, { count: jobsCount }, { count: appsCount }, { count: companiesCount } ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('companies').select('*', { count: 'exact', head: true })
  ]);
  return { users: usersCount || 0, jobs: jobsCount || 0, applications: appsCount || 0, companies: companiesCount || 0 };
}

export async function getAllUsers() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return data || [];
}

// --- WALLET & TRANSACTIONS ---

export interface Transaction {
  id: string;
  companyId: string;
  amount: number;
  type: 'deposit' | 'spend';
  description: string;
  createdAt: string;
}

export async function getCompanyBalance(): Promise<number> {
  const company = await getCurrentCompany();
  if (!company) return 0;
  
  // В реальном проекте лучше не доверять company.balance из кэша, а делать select
  const supabase = await createClient();
  const { data } = await supabase
    .from('companies')
    .select('balance')
    .eq('id', company.id)
    .single();
    
  return data?.balance || 0;
}

export async function getTransactions(): Promise<Transaction[]> {
  const company = await getCurrentCompany();
  if (!company) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });

  return (data || []).map((t: any) => ({
    id: t.id,
    companyId: t.company_id,
    amount: t.amount,
    type: t.type,
    description: t.description,
    createdAt: t.created_at
  }));
}

// Server-side only (called after webhook/success)
export async function processDeposit(companyId: string, amount: number, sessionId: string): Promise<void> {
  console.log(`[DEPOSIT] Processing deposit: ${amount} cents for company ${companyId}`);
  const supabase = createAdminClient(); 
  
  // 1. Check if already processed
  const { data: existing } = await supabase
    .from('transactions')
    .select('id')
    .eq('stripe_session_id', sessionId)
    .single();
    
  if (existing) {
    console.log('[DEPOSIT] Transaction already processed');
    return;
  }

  // 2. Add Transaction
  const { error: txError } = await supabase.from('transactions').insert({
    company_id: companyId,
    amount: amount,
    type: 'deposit',
    description: 'Пополнение баланса',
    stripe_session_id: sessionId
  });

  if (txError) {
    console.error('[DEPOSIT] Error inserting transaction:', JSON.stringify(txError, null, 2));
    return;
  }

  // 3. Update Balance
  const { data: company } = await supabase.from('companies').select('balance').eq('id', companyId).single();
  const newBalance = (company?.balance || 0) + amount;
  
  const { error: balError } = await supabase.from('companies').update({ balance: newBalance }).eq('id', companyId);

  if (balError) {
    console.error('[DEPOSIT] Error updating balance:', balError);
  } else {
    console.log(`[DEPOSIT] Balance updated. New balance: ${newBalance}`);
  }
}

export async function spendBalance(amount: number, description: string): Promise<boolean> {
  const company = await getCurrentCompany();
  if (!company) throw new Error('No company');
  
  const supabase = createAdminClient(); // Admin client to manage money securely

  // 1. Get fresh balance
  const { data: c } = await supabase.from('companies').select('balance').eq('id', company.id).single();
  const currentBalance = c?.balance || 0;

  if (currentBalance < amount) return false;

  // 2. Deduct
  await supabase.from('companies').update({ balance: currentBalance - amount }).eq('id', company.id);

  // 3. Record transaction
  await supabase.from('transactions').insert({
    company_id: company.id,
    amount: -amount,
    type: 'spend',
    description: description
  });

  return true;
}

// --- MAPPERS ---

function mapJobFromDB(dbJob: any): Job {
  return {
    id: dbJob.id,
    employerId: dbJob.employer_id,
    companyId: dbJob.company_id,
    title: dbJob.title,
    description: dbJob.description,
    location: dbJob.location,
    country: dbJob.country,
    city: dbJob.city,
    salaryRange: dbJob.salary_range,
    salaryMin: dbJob.salary_min,
    salaryMax: dbJob.salary_max,
    salaryPeriod: dbJob.salary_period,
    benefits: dbJob.benefits,
    isHighlighted: dbJob.is_highlighted,
    promotedUntil: dbJob.promoted_until,
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