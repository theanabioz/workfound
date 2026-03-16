'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Building, CreditCard, FileText, Send, Bookmark } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const isEmployer = pathname.includes('/dashboard/employer');

  const employerLinks = [
    { name: 'Обзор', href: '/dashboard/employer', icon: LayoutDashboard },
    { name: 'Вакансии', href: '/dashboard/employer/jobs', icon: Briefcase },
    { name: 'Сообщения', href: '/dashboard/employer/messages', icon: MessageSquare },
    { name: 'Профиль', href: '/dashboard/employer/profile', icon: Building },
  ];

  const seekerLinks = [
    { name: 'Поиск', href: '/dashboard/seeker', icon: LayoutDashboard },
    { name: 'Отклики', href: '/dashboard/seeker/applications', icon: Send },
    { name: 'Сообщения', href: '/dashboard/seeker/messages', icon: MessageSquare },
    { name: 'Профиль', href: '/dashboard/seeker/resume', icon: FileText },
  ];

  const links = isEmployer ? employerLinks : seekerLinks;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                isActive ? 'text-zinc-900' : 'text-zinc-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
