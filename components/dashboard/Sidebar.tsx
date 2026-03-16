'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { EMPLOYER_LINKS, SEEKER_LINKS } from '@/utils/constants';

export default function Sidebar() {
  const pathname = usePathname();
  const isEmployer = pathname.includes('/dashboard/employer');
  const links = isEmployer ? EMPLOYER_LINKS : SEEKER_LINKS;

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <nav className="space-y-1.5 sticky top-24">
        {links.map((link) => {
          const Icon = (Icons as any)[link.icon];
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
  );
}
