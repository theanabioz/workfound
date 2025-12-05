import fs from 'fs/promises';
import path from 'path';
import { Job, Application, UserProfile, Resume } from '@/types';

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'db.json');

// Начальные данные (Seed)
const INITIAL_DATA = {
  jobs: [
    {
      id: '1',
      employerId: 'emp-1',
      title: 'Строитель-универсал',
      description: 'Требуется опытный строитель для внутренней отделки. Работа в Берлине.',
      location: 'Berlin, Germany',
      salaryRange: '15-20 EUR / час',
      applicationMethod: 'phone',
      contactInfo: '+49 123 456 789',
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      employerId: 'emp-1',
      title: 'Водитель грузовика (Category CE)',
      description: 'Международные перевозки. Полный соцпакет. Опыт от 1 года.',
      location: 'Warsaw, Poland',
      salaryRange: '2500 - 3000 EUR / месяц',
      applicationMethod: 'internal_ats',
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ] as Job[],
  users: [
    {
      id: 'emp-1',
      email: 'employer@test.com',
      role: 'employer',
      fullName: 'Hans Mueller',
      companyName: 'Bau Berlin GmbH',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seek-1',
      email: 'seeker@test.com',
      role: 'seeker',
      fullName: 'Ivan Petrov',
      createdAt: new Date().toISOString(),
    }
  ] as UserProfile[],
  applications: [] as Application[],
  resumes: [
    {
      id: 'res-1',
      userId: 'seek-1',
      title: 'Водитель (Основное)',
      about: 'Ответственный водитель без вредных привычек.',
      skills: 'Категория CE, Тахограф, Польский язык',
      experience: '5 лет в Girteka Logistics',
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ] as Resume[]
};

export async function getDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as typeof INITIAL_DATA;
  } catch (error) {
    // Если файла нет, создаем его
    await fs.writeFile(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
    return INITIAL_DATA;
  }
}

export async function saveDB(data: typeof INITIAL_DATA) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}