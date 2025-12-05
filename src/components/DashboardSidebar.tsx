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
  MessageSquare
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: any;
}

interface DashboardSidebarProps {
  role: 'employer' | 'seeker';
  userName: string;
}

export function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const employerLinks: SidebarItem[] = [
    { label: 'Обзор', href: '/employer/dashboard', icon: LayoutDashboard },
    { label: 'Мои Вакансии', href: '/employer/jobs', icon: Briefcase },
    { label: 'Поиск резюме', href: '/employer/search', icon: Search },
    { label: 'Календарь', href: '/employer/calendar', icon: Calendar },
    { label: 'Сообщения', href: '/employer/messages', icon: MessageSquare }, // New
    { label: 'Избранные', href: '/employer/saved', icon: Bookmark },
    { label: 'Отклики (ATS)', href: '/employer/applications', icon: Users },
    { label: 'Настройки', href: '/employer/settings', icon: Settings },
  ];

  const seekerLinks: SidebarItem[] = [
    { label: 'Моя карьера', href: '/seeker/dashboard', icon: LayoutDashboard },
    { label: 'Мои резюме', href: '/seeker/resumes', icon: FileText },
    { label: 'Сохраненные', href: '/seeker/saved', icon: Bookmark },
    { label: 'Сообщения', href: '/seeker/messages', icon: MessageSquare }, // New (Create page later)
    { label: 'Поиск работы', href: '/', icon: Briefcase },
    { label: 'Профиль', href: '/seeker/profile', icon: UserCircle },
  ];

  const links = role === 'employer' ? employerLinks : seekerLinks;

  return (
    <>
      {/* Mobile Trigger (Hamburger) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-sm border border-gray-200 md:hidden hover:bg-gray-50"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Overlay (Backdrop) */}
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
        
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link href="/" className="font-bold text-xl tracking-tight text-gray-900 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className={`w-2 h-2 rounded-full ${role === 'employer' ? 'bg-blue-600' : 'bg-green-600'}`} />
            Workfound
          </Link>
          
          {/* Close Button (Mobile only) */}
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
              <UserCircle className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate max-w-[140px]" title={userName}>{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{role === 'employer' ? 'Работодатель' : 'Соискатель'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)} // Close on click (mobile)
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => signout()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Выйти
          </button>
        </div>
      </aside>
    </>
  );
}