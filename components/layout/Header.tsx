'use client';

import Link from 'next/link';
import { Briefcase, User, Menu, Bell, LogOut, ChevronDown, Settings, LayoutDashboard } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { signout } from '@/app/login/actions';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-slate-900 hover:opacity-80 transition-opacity">
            <Briefcase className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-slate-900">Work<span className="text-slate-500">Found</span></span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">Главная</Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">Вакансии</Link>
          
          <div className="w-px h-4 bg-slate-200"></div>
          
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-4">
                <Link href={dashboardUrl} className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
                  Панель управления
                </Link>
                <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
                <div className="relative pl-4 border-l border-slate-200" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 cursor-pointer group focus:outline-none"
                  >
                    <div className="w-7 h-7 bg-slate-100 border border-slate-200 text-slate-700 rounded-md flex items-center justify-center font-bold text-xs group-hover:bg-slate-200 transition-colors">
                      {name ? name.charAt(0).toUpperCase() : (isEmployer ? 'T' : 'А')}
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors max-w-[120px] truncate">
                      {name || (isEmployer ? 'TransLogistics' : 'Алексей С.')}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900 truncate">{name || (isEmployer ? 'TransLogistics' : 'Алексей С.')}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      
                      <Link 
                        href={dashboardUrl} 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Панель управления
                      </Link>
                      
                      <Link 
                        href={`${dashboardUrl}/settings`} 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Настройки
                      </Link>
                      
                      <div className="h-px bg-slate-100 my-1"></div>
                      
                      <form action={signout}>
                        <button 
                          type="submit" 
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Выйти
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors">
                  <User className="w-4 h-4" />
                  Войти
                </Link>
                <Link href="/login" className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-4 py-2 rounded-md font-medium transition-colors">
                  Разместить вакансию
                </Link>
              </div>
            )
          )}
        </div>

        <button className="md:hidden text-slate-600">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
