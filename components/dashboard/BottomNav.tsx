'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { EMPLOYER_LINKS, SEEKER_LINKS } from '@/utils/constants';

export default function BottomNav() {
  const pathname = usePathname();
  const isEmployer = pathname.includes('/dashboard/employer');
  const allLinks = isEmployer ? EMPLOYER_LINKS : SEEKER_LINKS;
  
  // Take only the first 4 links for the bottom nav
  const links = allLinks.slice(0, 4);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const Icon = (Icons as any)[link.icon];
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
