import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-black text-white p-1.5 rounded-lg group-hover:rotate-3 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Workfound</span>
          </Link>

          {/* Public Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              Поиск работы
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              Для компаний
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              Цены
            </Link>
          </div>

          {/* Auth Buttons (Mock) */}
          <div className="flex items-center gap-3">
            <Link 
              href="/seeker/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-black px-3 py-2"
            >
              Я соискатель
            </Link>
            <Link 
              href="/employer/dashboard"
              className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-200"
            >
              Работодатель
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
