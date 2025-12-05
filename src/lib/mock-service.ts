'use server';

import { Job, UserProfile, Application, Resume } from '@/types';
import { getDB, saveDB } from './storage';

// Имитация задержки
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- JOBS ---
export async function getJobs(): Promise<Job[]> {
  const db = await getDB();
  return db.jobs;
}

export async function getJobById(id: string): Promise<Job | undefined> {
  const db = await getDB();
  return db.jobs.find(j => j.id === id);
}

export async function createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
  const db = await getDB();
  const newJob: Job = {
    ...jobData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.jobs.push(newJob);
  await saveDB(db);
  return newJob;
}

// --- USERS ---
export async function loginAs(role: 'employer' | 'seeker'): Promise<UserProfile> {
  const db = await getDB();
  if (role === 'employer') return db.users[0];
  return db.users[1];
}

// --- APPLICATIONS ---
export async function submitApplication(appData: Omit<Application, 'id' | 'status' | 'createdAt'>): Promise<Application> {
  const db = await getDB();
  const newApp: Application = {
    ...appData,
    id: Math.random().toString(36).substr(2, 9),
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  db.applications.push(newApp);
  await saveDB(db);
  return newApp;
}

export async function getApplicationsForJob(jobId: string): Promise<Application[]> {
  const db = await getDB();
  return db.applications.filter(app => app.jobId === jobId);
}

export async function getEmployerApplications(employerId: string): Promise<(Application & { jobTitle: string; resume?: Resume })[]> {
  const db = await getDB();
  
  // 1. Находим все вакансии этого работодателя
  const employerJobIds = db.jobs
    .filter(j => j.employerId === employerId)
    .map(j => j.id);
  
  // 2. Находим отклики на эти вакансии
  const apps = db.applications.filter(app => employerJobIds.includes(app.jobId));

  // 3. Добавляем название вакансии и данные резюме
  return apps.map(app => {
    const job = db.jobs.find(j => j.id === app.jobId);
    const resume = app.resumeId ? (db.resumes || []).find(r => r.id === app.resumeId) : undefined;
    
    return { 
      ...app, 
      jobTitle: job ? job.title : 'Unknown Job',
      resume
    };
  });
}

// --- RESUMES ---
export async function getResumes(userId: string): Promise<Resume[]> {
  const db = await getDB();
  // Если в старой базе нет массива resumes, вернем пустой массив
  return (db.resumes || []).filter(r => r.userId === userId);
}

export async function getResumeById(id: string): Promise<Resume | undefined> {
  const db = await getDB();
  return (db.resumes || []).find(r => r.id === id);
}

export async function createResume(resumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resume> {
  const db = await getDB();
  const newResume: Resume = {
    ...resumeData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (!db.resumes) db.resumes = [];
  db.resumes.push(newResume);
  await saveDB(db);
  return newResume;
}