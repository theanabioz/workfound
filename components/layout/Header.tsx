'use client';

import Link from 'next/link';
import { Briefcase, User, Menu, Bell, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { signout } from '@/app/login/actions';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setRole(user.user_metadata?.role || 'seeker');
        setName(user.user_metadata?.name || user.email);
      }
      setIsLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setRole(session.user.user_metadata?.role || 'seeker');
        setName(session.user.user_metadata?.name || session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);
  
  const isEmployer = role === 'employer';
  const dashboardUrl = isEmployer ? '/dashboard/employer' : '/dashboard/seeker';

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:opacity-80 transition-opacity">
            <Briefcase className="w-8 h-8" />
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">Work<span className="text-blue-600">Found</span></span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/vacancies" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Вакансии</Link>
          <Link href="/companies" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Компании</Link>
          
          <div className="w-px h-6 bg-slate-200"></div>
          
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-6">
                <Link href={dashboardUrl} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                  Панель управления
                </Link>
                <button className="text-slate-500 hover:text-blue-600 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
                <div className="flex items-center gap-4 pl-2 border-l border-slate-200">
                  <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm group-hover:bg-blue-200 transition-colors">
                      {name ? name.charAt(0).toUpperCase() : (isEmployer ? 'T' : 'А')}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors max-w-[120px] truncate">
                      {name || (isEmployer ? 'TransLogistics' : 'Алексей С.')}
                    </span>
                  </div>
                  <form action={signout}>
                    <button type="submit" className="text-slate-400 hover:text-red-600 transition-colors ml-2 flex items-center" title="Выйти">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/login" className="text-slate-600 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">
                  <User className="w-5 h-5" />
                  Войти
                </Link>
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30">
                  Разместить вакансию
                </Link>
              </div>
            )
          )}
        </div>

        <button className="md:hidden text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
