'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function SiteFooter() {
  const pathname = usePathname();

  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group opacity-50 hover:opacity-100 transition-opacity">
              <Briefcase className="w-5 h-5" />
              <span className="font-bold text-lg tracking-tight">Workfound</span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed">
              Современная платформа для поиска работы и найма сотрудников в Европе.
            </p>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Соискателям</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-black transition-colors">Поиск вакансий</Link></li>
              <li><Link href="/seeker/resumes" className="hover:text-black transition-colors">Создать резюме</Link></li>
              <li><Link href="/seeker/alerts" className="hover:text-black transition-colors">Подписка на вакансии</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Калькулятор зарплат</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Работодателям</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/employer/jobs/new" className="hover:text-black transition-colors">Разместить вакансию</Link></li>
              <li><Link href="/employer/search" className="hover:text-black transition-colors">Поиск кандидатов</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Тарифы</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Интеграция API</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">О компании</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-black transition-colors">О нас</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Контакты</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Блог</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Политика конфиденциальности</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Workfound Inc. Все права защищены.
          </p>
          
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-black transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-black transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-black transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="hover:text-black transition-colors"><Instagram className="w-5 h-5" /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}