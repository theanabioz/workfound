'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Building, CreditCard, FileText, Send, Bookmark } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const isEmployer = pathname.includes('/dashboard/employer');

  const employerLinks = [
    { name: 'Обзор', href: '/dashboard/employer', icon: LayoutDashboard },
    { name: 'Мои вакансии', href: '/dashboard/employer/jobs', icon: Briefcase },
    { name: 'Отклики', href: '/dashboard/employer/applications', icon: Users },
    { name: 'Сообщения', href: '/dashboard/employer/messages', icon: MessageSquare },
    { name: 'Профиль компании', href: '/dashboard/employer/profile', icon: Building },
    { name: 'Платные услуги', href: '/dashboard/employer/billing', icon: CreditCard },
  ];

  const seekerLinks = [
    { name: 'Обзор', href: '/dashboard/seeker', icon: LayoutDashboard },
    { name: 'Мое резюме', href: '/dashboard/seeker/resume', icon: FileText },
    { name: 'Мои отклики', href: '/dashboard/seeker/applications', icon: Send },
    { name: 'Сохраненные', href: '/dashboard/seeker/saved', icon: Bookmark },
    { name: 'Сообщения', href: '/dashboard/seeker/messages', icon: MessageSquare },
  ];

  const links = isEmployer ? employerLinks : seekerLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <nav className="space-y-1.5 sticky top-24">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
