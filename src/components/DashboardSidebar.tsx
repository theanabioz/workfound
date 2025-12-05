'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { signout } from '@/app/auth/actions';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  FileText,
  UserCircle,
  Bookmark,
  Search,
  Calendar,
  Menu,
  X,
  MessageSquare,
  History,
  Bell
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: any;
}

interface SidebarSection {
  title?: string; // Optional section title
  items: SidebarItem[];
}

interface DashboardSidebarProps {
  role: 'employer' | 'seeker';
  userName: string;
}

export function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // --- Navigation Structure ---
  const employerSections: SidebarSection[] = [
    {
      title: 'Главное',
      items: [
        { label: 'Обзор', href: '/employer/dashboard', icon: LayoutDashboard },
        { label: 'Календарь', href: '/employer/calendar', icon: Calendar },
      ]
    },
    {
      title: 'Найм',
      items: [
        { label: 'Вакансии', href: '/employer/jobs', icon: Briefcase },
        { label: 'Кандидаты', href: '/employer/search', icon: Search },
        { label: 'Воронка (ATS)', href: '/employer/applications', icon: Users },
        { label: 'Избранное', href: '/employer/saved', icon: Bookmark },
      ]
    },
    {
      title: 'Связь',
      items: [
        { label: 'Сообщения', href: '/employer/messages', icon: MessageSquare },
      ]
    },
    {
      title: 'Система',
      items: [
        { label: 'Настройки', href: '/employer/settings', icon: Settings },
      ]
    }
  ];

  const seekerSections: SidebarSection[] = [
    {
      title: 'Моя карьера',
      items: [
        { label: 'Дашборд', href: '/seeker/dashboard', icon: LayoutDashboard },
        { label: 'Мои резюме', href: '/seeker/resumes', icon: FileText },
      ]
    },
    {
      title: 'Поиск',
      items: [
        { label: 'Найти работу', href: '/', icon: Search },
        { label: 'Подписки', href: '/seeker/alerts', icon: Bell }, // New
        { label: 'Избранное', href: '/seeker/saved', icon: Bookmark },
        { label: 'Сообщения', href: '/seeker/messages', icon: MessageSquare },
      ]
    },
    {
      title: 'Профиль',
      items: [
        { label: 'Настройки', href: '/seeker/profile', icon: UserCircle },
      ]
    }
  ];

  const sections = role === 'employer' ? employerSections : seekerSections;

  return (
    <>
      {/* Mobile Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-sm border border-gray-200 md:hidden hover:bg-gray-50"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-gray-200 fixed h-full left-0 top-0 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
          <Link href="/" className="font-bold text-xl tracking-tight text-gray-900 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className={`w-2 h-2 rounded-full ${role === 'employer' ? 'bg-blue-600' : 'bg-green-600'}`} />
            Workfound
          </Link>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {sections.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium transition-all group ${
                        isActive 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 capitalize truncate">{role === 'employer' ? 'Работодатель' : 'Соискатель'}</p>
            </div>
          </div>
          
          <button 
            onClick={() => signout()}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Выйти из аккаунта
          </button>
        </div>

      </aside>
    </>
  );
}
