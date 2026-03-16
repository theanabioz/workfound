import Link from 'next/link';
import { Briefcase, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Globe, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Socials */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 text-zinc-50 hover:opacity-80 transition-opacity">
              <Briefcase className="w-6 h-6" />
              <span className="text-xl font-bold tracking-tight">Work<span className="text-zinc-500">Found</span></span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Первая платформа для поиска надежной работы в Европе для специалистов рабочих специальностей. Мы объединяем проверенных работодателей и квалифицированных кадров.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-none border border-zinc-800 hover:border-zinc-600 hover:text-zinc-50 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-none border border-zinc-800 hover:border-zinc-600 hover:text-zinc-50 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-none border border-zinc-800 hover:border-zinc-600 hover:text-zinc-50 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-none border border-zinc-800 hover:border-zinc-600 hover:text-zinc-50 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: For Seekers */}
          <div>
            <h4 className="text-zinc-50 font-bold uppercase tracking-widest text-xs mb-6">Соискателям</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-zinc-50 transition-colors">Все вакансии</Link></li>
              <li><Link href="/" className="hover:text-zinc-50 transition-colors">Работа в Польше</Link></li>
              <li><Link href="/" className="hover:text-zinc-50 transition-colors">Работа в Германии</Link></li>
              <li><Link href="/" className="hover:text-zinc-50 transition-colors">Для водителей</Link></li>
              <li><Link href="/" className="hover:text-zinc-50 transition-colors">Для строителей</Link></li>
            </ul>
          </div>

          {/* Column 3: For Employers */}
          <div>
            <h4 className="text-zinc-50 font-bold uppercase tracking-widest text-xs mb-6">Работодателям</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/login" className="hover:text-zinc-50 transition-colors">Разместить вакансию</Link></li>
              <li><Link href="/" className="hover:text-zinc-50 transition-colors">Тарифы и цены</Link></li>
              <li><Link href="/" className="hover:text-zinc-50 transition-colors">Поиск сотрудников</Link></li>
              <li><Link href="/" className="hover:text-zinc-50 transition-colors">Реклама вакансий</Link></li>
              <li><Link href="/" className="hover:text-zinc-50 transition-colors">Блог для бизнеса</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-zinc-50 font-bold uppercase tracking-widest text-xs mb-6">Контакты</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                <span>Warsaw, Poland<br />ul. Marszałkowska 126/134</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-zinc-600 shrink-0" />
                <span>+48 22 123 45 67</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-zinc-600 shrink-0" />
                <span>support@workfound.eu</span>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <Globe className="w-4 h-4 text-zinc-600 shrink-0" />
                <span className="flex items-center gap-2">
                  Русский 
                  <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                  EUR
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest">
          <p>© {currentYear} WorkFound. Все права защищены.</p>
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:text-zinc-50 transition-colors">Политика конфиденциальности</Link>
            <Link href="/" className="hover:text-zinc-50 transition-colors">Публичная оферта</Link>
            <Link href="/" className="hover:text-zinc-50 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
