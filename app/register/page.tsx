'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Briefcase, Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'seeker';
  const [role, setRole] = useState<'seeker' | 'employer'>(initialRole);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-900 justify-center hover:opacity-80 transition-opacity">
          <Briefcase className="w-10 h-10" />
          <span className="text-3xl font-extrabold tracking-tight text-zinc-900">Work<span className="text-zinc-500">Found</span></span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-zinc-900">
          Создайте аккаунт
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600">
          Или{' '}
          <Link href="/login" className="font-medium text-zinc-900 hover:text-zinc-600 transition-colors underline underline-offset-4">
            войдите в существующий
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:px-10 border border-zinc-200">
          <form className="space-y-8" action="#" method="POST">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">Я хочу...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`flex flex-col items-center justify-center p-4 rounded-none border-2 transition-all ${
                    role === 'seeker' 
                      ? 'border-zinc-900 bg-zinc-50 text-zinc-900' 
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <User className={`w-6 h-6 mb-2 ${role === 'seeker' ? 'text-zinc-900' : 'text-zinc-400'}`} />
                  <span className="font-semibold text-sm">Найти работу</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`flex flex-col items-center justify-center p-4 rounded-none border-2 transition-all ${
                    role === 'employer' 
                      ? 'border-zinc-900 bg-zinc-50 text-zinc-900' 
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <Building2 className={`w-6 h-6 mb-2 ${role === 'employer' ? 'text-zinc-900' : 'text-zinc-400'}`} />
                  <span className="font-semibold text-sm">Найти сотрудников</span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
                Email
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 border border-zinc-200 rounded-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm bg-zinc-50 text-zinc-900 transition-colors outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
                Пароль
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full pl-12 pr-4 py-3.5 border border-zinc-200 rounded-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm bg-zinc-50 text-zinc-900 transition-colors outline-none"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500 font-medium">
                Минимум 8 символов
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-none text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-all"
              >
                Зарегистрироваться
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 flex items-center justify-center text-zinc-500 font-medium text-sm uppercase tracking-wider">Загрузка...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
