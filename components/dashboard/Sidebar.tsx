'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Building, CreditCard, FileText, Send, Bookmark, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const isEmployer = pathname.includes('/dashboard/employer');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
  const activeLink = links.find(link => pathname === link.href) || links[0];

  return (
    <>
      {/* Mobile Navigation Dropdown */}
      <div className="md:hidden mb-6 relative z-30">
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between bg-white border border-zinc-200 px-4 py-3 text-sm font-bold uppercase tracking-wider text-zinc-900"
        >
          <div className="flex items-center gap-3">
            <activeLink.icon className="w-4 h-4 text-zinc-400" />
            {activeLink.name}
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isMobileOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isMobileOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 shadow-lg">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-zinc-50 text-zinc-900 border-l-2 border-zinc-900'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border-l-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 shrink-0 hidden md:block">
        <nav className="space-y-1.5 sticky top-24">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-none font-semibold text-sm uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
