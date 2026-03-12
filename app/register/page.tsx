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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 justify-center hover:opacity-80 transition-opacity">
          <Briefcase className="w-10 h-10" />
          <span className="text-3xl font-extrabold tracking-tight text-slate-900">Work<span className="text-blue-600">Found</span></span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          Создайте аккаунт
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Или{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            войдите в существующий
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-200/75">
          <form className="space-y-6" action="#" method="POST">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Я хочу...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    role === 'seeker' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <User className={`w-6 h-6 mb-2 ${role === 'seeker' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-semibold text-sm">Найти работу</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('employer')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    role === 'employer' 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className={`w-6 h-6 mb-2 ${role === 'employer' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-semibold text-sm">Найти сотрудников</span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900">
                Email
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-11 pr-3 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 text-slate-900 transition-colors outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-900">
                Пароль
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full pl-11 pr-3 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 text-slate-900 transition-colors outline-none"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Минимум 8 символов
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Загрузка...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
