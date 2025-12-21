export type UserRole = 'employer' | 'seeker' | 'admin';

export type ApplicationMethod = 
  | 'internal_ats'   // Работодатель хочет получать резюме на сайте
  | 'phone'          // "Позвонить"
  | 'whatsapp'       // "Написать в WhatsApp"
  | 'viber';         // "Написать в Viber"

export type JobStatus = 'draft' | 'published' | 'closed';

export type ApplicationStatus = 
  | 'new'        // Только пришло
  | 'viewed'     // Просмотрено работодателем
  | 'interview'  // Приглашен на собеседование
  | 'offer'      // Предложена работа
  | 'rejected';  // Отказ

// Профиль пользователя (и работодателя, и соискателя)
export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  companyName?: string; // Только для работодателей
  phone?: string;       // Контактный телефон по умолчанию
  createdAt: string;
}

// Вакансия
export interface Job {
  id: string;
  employerId: string; // Связь с UserProfile
  title: string;
  description: string; // Будет поддерживать HTML/Markdown позже
  location: string;
  country?: string;
  city?: string;
  salaryRange: string; // Отображаемая строка (legacy or computed)
  salaryMin?: number;  // От
  salaryMax?: number;  // До
  salaryPeriod?: 'hour' | 'month' | 'year'; // Период оплаты
  benefits?: string[]; // Массив
  company?: Company; 
  isHighlighted?: boolean;
  promotedUntil?: string;
  views?: number;
  
  // Ключевой блок для выбора способа найма
  applicationMethod: ApplicationMethod;
  contactInfo?: string; // Номер телефона или ссылка, если выбран не ATS метод
  
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  questions?: JobQuestion[]; 
  companyId?: string; // Привязка к компании
}

export interface Company {
  id: string;
  name: string;
  slug?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  createdAt: string;
}

export interface CompanyMember {
  id: string;
  companyId: string;
  userId: string;
  role: 'owner' | 'admin' | 'recruiter';
  profile?: UserProfile;
}

export interface JobQuestion {
  id?: string; // Опционально при создании
  jobId?: string;
  questionText: string;
  correctAnswer?: 'yes' | 'no'; // Для MVP только Да/Нет
  isDisqualifying: boolean;
}

export interface QuestionAnswer {
  questionId: string;
  answerText: string;
}

// Отклик (Только для режима ATS)
export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  status: ApplicationStatus;
  
  // Данные кандидата для конкретного отклика
  resumeId?: string;      // ID выбранного резюме из профиля
  resumeUrl?: string;     // Ссылка на файл (для старых откликов или внешних файлов)
  coverLetter?: string;   // Сопроводительное письмо
  answers?: QuestionAnswer[]; // Ответы кандидата
  
  createdAt: string;
}

// Резюме (Конструктор)
export interface Resume {
  id: string;
  userId: string;       // Чье это резюме
  title: string;        // Название для себя (например: "На стройку", "Офис")
  
  // Содержание
  about: string;        // О себе
  skills: string;       // Навыки (через запятую или массив)
  experience: string;   // Опыт работы (текстом для MVP)
  
  isPublic: boolean;    // Видно ли работодателям в поиске (на будущее)
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  employerId: string;
  applicationId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  eventType: 'interview' | 'call' | 'other';
  candidateName?: string;
}

export interface Conversation {
  id: string;
  employerId: string;
  seekerId: string;
  jobId?: string;
  updatedAt: string;
  otherUser?: {
    fullName: string;
    role?: string;
  };
  lastMessage?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  applicationId: string;
  authorId: string;
  content: string;
  createdAt: string;
  author?: {
    fullName: string;
  };
}