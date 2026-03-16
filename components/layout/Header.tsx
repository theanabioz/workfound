'use client';

import Link from 'next/link';
import { Briefcase, User, Menu, X, Bell, LogOut, ChevronDown, Settings, LayoutDashboard } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { signout } from '@/app/login/actions';
import { EMPLOYER_LINKS, SEEKER_LINKS } from '@/utils/constants';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const dashboardLinks = isEmployer ? EMPLOYER_LINKS : SEEKER_LINKS;

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-zinc-900 hover:opacity-80 transition-opacity">
            <Briefcase className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-zinc-900">Work<span className="text-zinc-500">Found</span></span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors">Главная</Link>
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors">Вакансии</Link>
          
          <div className="w-px h-4 bg-zinc-200"></div>
          
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-4">
                <Link href={dashboardUrl} className="text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors">
                  Панель управления
                </Link>
                <button className="text-zinc-400 hover:text-zinc-600 transition-colors relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
                <div className="relative pl-4 border-l border-zinc-200" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 cursor-pointer group focus:outline-none"
                  >
                    <div className="w-7 h-7 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-none flex items-center justify-center font-bold text-xs group-hover:bg-zinc-200 transition-colors">
                      {name ? name.charAt(0).toUpperCase() : (isEmployer ? 'T' : 'А')}
                    </div>
                    <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors max-w-[120px] truncate">
                      {name || (isEmployer ? 'TransLogistics' : 'Алексей С.')}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-zinc-100">
                        <p className="text-sm font-medium text-zinc-900 truncate">{name || (isEmployer ? 'TransLogistics' : 'Алексей С.')}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      </div>
                      
                      <Link 
                        href={dashboardUrl} 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                        Панель управления
                      </Link>
                      
                      <Link 
                        href={`${dashboardUrl}/settings`} 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-zinc-400" />
                        Настройки
                      </Link>
                      
                      <div className="h-px bg-zinc-100 my-1"></div>
                      
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
                <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 font-medium flex items-center gap-1.5 transition-colors">
                  <User className="w-4 h-4" />
                  Войти
                </Link>
                <Link href="/login" className="bg-zinc-900 hover:bg-zinc-800 text-white text-sm px-4 py-2 font-medium transition-colors">
                  Разместить вакансию
                </Link>
              </div>
            )
          )}
        </div>

        <button 
          className="md:hidden text-zinc-600 p-2 -mr-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white absolute top-14 left-0 right-0 shadow-lg z-40">
          <div className="px-4 py-4 space-y-4">
            <Link href="/" className="block text-base font-medium text-zinc-900" onClick={() => setIsMobileMenuOpen(false)}>Главная</Link>
            <Link href="/" className="block text-base font-medium text-zinc-900" onClick={() => setIsMobileMenuOpen(false)}>Вакансии</Link>
            
            <div className="h-px bg-zinc-200 my-4"></div>
            
            {!isLoading && (
              user ? (
                <div className="space-y-4">
                  {dashboardLinks.map((link) => {
                    const Icon = (Icons as any)[link.icon];
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center gap-3 text-base font-medium text-zinc-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5 text-zinc-400" />
                        {link.name}
                      </Link>
                    );
                  })}
                  
                  <Link 
                    href={`${dashboardUrl}/settings`} 
                    className="flex items-center gap-3 text-base font-medium text-zinc-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 text-zinc-400" />
                    Настройки
                  </Link>
                  
                  <form action={signout}>
                    <button 
                      type="submit" 
                      className="w-full flex items-center gap-3 text-base font-medium text-red-600 text-left"
                    >
                      <LogOut className="w-5 h-5 text-red-500" />
                      Выйти
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link 
                    href="/login" 
                    className="flex items-center gap-3 text-base font-medium text-zinc-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 text-zinc-400" />
                    Войти
                  </Link>
                  <Link 
                    href="/login" 
                    className="block w-full text-center bg-zinc-900 text-white text-base py-3 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Разместить вакансию
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
