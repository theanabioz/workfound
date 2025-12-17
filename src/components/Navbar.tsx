import Link from 'next/link';
import { Briefcase, User, LogOut, LayoutDashboard } from 'lucide-react';
import { getCurrentUser } from '@/lib/supabase-service';
import { signout } from '@/app/auth/actions';

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-md bg-white/90">
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
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Поиск работы
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Для компаний
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Цены
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  {user.email}
                </span>
                
                <Link 
                  href={user.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'}
                  className="flex items-center gap-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Кабинет</span>
                </Link>

                <form action={signout}>
                  <button className="text-gray-400 hover:text-red-600 p-2 transition-colors" title="Выйти">
                    <LogOut className="w-5 h-5" />
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-black px-3 py-2"
                >
                  Войти
                </Link>
                <Link 
                  href="/register"
                  className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-200"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}