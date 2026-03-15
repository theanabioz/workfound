'use client';

import Link from 'next/link';
import { Briefcase, Mail, Lock, User as UserIcon, Building2, ArrowRight } from 'lucide-react';
import { useState, Suspense } from 'react';
import { login, signup } from './actions';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'seeker' | 'employer'>('seeker');
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(searchParams.get('message'));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setMessage(null);
    setSuccessMessage(null);
    
    const action = isLogin ? login : signup;
    const result = await action(formData);
    
    setIsPending(false);
    
    if (result?.error) {
      if (result.error.includes('Регистрация успешна')) {
        setSuccessMessage(result.error);
        setIsLogin(true); // Switch to login view
      } else {
        setMessage(result.error);
      }
    }
    // If success, the server action will redirect, so we don't need to do anything else here
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 justify-center hover:opacity-80 transition-opacity">
          <Briefcase className="w-10 h-10" />
          <span className="text-3xl font-extrabold tracking-tight text-slate-900">Work<span className="text-blue-600">Found</span></span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          {isLogin ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isLogin ? 'Или ' : 'Уже есть аккаунт? '}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage(null);
              setSuccessMessage(null);
            }} 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            {isLogin ? 'создайте новый аккаунт' : 'войдите в систему'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-200/75">
          {message && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-200 text-center">
              {message}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm font-medium rounded-xl border border-green-200 text-center">
              {successMessage}
            </div>
          )}
          
          <form className="space-y-6" action={handleSubmit}>
            {!isLogin && (
              <>
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Я хочу...
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('seeker')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-sm transition-all ${
                        role === 'seeker' 
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <UserIcon className="w-4 h-4" />
                      Найти работу
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('employer')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-sm transition-all ${
                        role === 'employer' 
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Найти людей
                    </button>
                  </div>
                  <input type="hidden" name="role" value={role} />
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-900">
                    {role === 'seeker' ? 'Имя и Фамилия' : 'Название компании'}
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      {role === 'seeker' ? <UserIcon className="h-5 w-5 text-slate-400" /> : <Building2 className="h-5 w-5 text-slate-400" />}
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      className="block w-full pl-11 pr-3 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 text-slate-900 transition-colors outline-none"
                      placeholder={role === 'seeker' ? 'Иван Иванов' : 'ООО Компания'}
                    />
                  </div>
                </div>
              </>
            )}

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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-900">
                  Пароль
                </label>
                {isLogin && (
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                      Забыли пароль?
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  className="block w-full pl-11 pr-3 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-slate-50 text-slate-900 transition-colors outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-70"
            >
              {isPending ? 'Подождите...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <Suspense fallback={<div className="text-center py-10">Загрузка...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
