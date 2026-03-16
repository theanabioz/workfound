'use client';

import Link from 'next/link';
import { Briefcase, Mail, Lock, User as UserIcon, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { useState, Suspense, useTransition } from 'react';
import { login, signup } from './actions';
import { useSearchParams, useRouter } from 'next/navigation';

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'seeker' | 'employer'>('seeker');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(searchParams.get('message'));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setMessage(null);
    setSuccessMessage(null);
    
    startTransition(async () => {
      const action = isLogin ? login : signup;
      const result = await action(formData);
      
      if (result?.error) {
        if (result.error.includes('Регистрация успешна')) {
          setSuccessMessage(result.error);
          setIsLogin(true); // Switch to login view
        } else {
          setMessage(result.error);
        }
      } else if (result?.success) {
        router.push(`/dashboard/${result.role}`);
        router.refresh();
      }
    });
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-900 justify-center hover:opacity-80 transition-opacity">
          <Briefcase className="w-10 h-10" />
          <span className="text-3xl font-extrabold tracking-tight text-zinc-900">Work<span className="text-zinc-500">Found</span></span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-zinc-900">
          {isLogin ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600">
          {isLogin ? 'Или ' : 'Уже есть аккаунт? '}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage(null);
              setSuccessMessage(null);
            }} 
            className="font-medium text-zinc-900 hover:text-zinc-700 underline decoration-zinc-400 underline-offset-4 transition-colors"
          >
            {isLogin ? 'создайте новый аккаунт' : 'войдите в систему'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:px-10 border border-zinc-200">
          {message && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-medium border border-red-200 text-center">
              {message}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm font-medium border border-green-200 text-center">
              {successMessage}
            </div>
          )}
          
          <form className="space-y-6" action={handleSubmit}>
            {!isLogin && (
              <>
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2 uppercase tracking-wider">
                    Я хочу...
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('seeker')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 border font-semibold text-sm transition-all ${
                        role === 'seeker' 
                          ? 'bg-zinc-900 border-zinc-900 text-white' 
                          : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      <UserIcon className="w-4 h-4" />
                      Найти работу
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('employer')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 border font-semibold text-sm transition-all ${
                        role === 'employer' 
                          ? 'bg-zinc-900 border-zinc-900 text-white' 
                          : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
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
                  <label htmlFor="name" className="block text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                    {role === 'seeker' ? 'Имя и Фамилия' : 'Название компании'}
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      {role === 'seeker' ? <UserIcon className="h-5 w-5 text-zinc-400" /> : <Building2 className="h-5 w-5 text-zinc-400" />}
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      className="block w-full pl-11 pr-3 py-3.5 border border-zinc-200 focus:ring-0 focus:border-zinc-500 sm:text-sm bg-zinc-50 text-zinc-900 transition-colors outline-none"
                      placeholder={role === 'seeker' ? 'Иван Иванов' : 'ООО Компания'}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                Email
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-11 pr-3 py-3.5 border border-zinc-200 focus:ring-0 focus:border-zinc-500 sm:text-sm bg-zinc-50 text-zinc-900 transition-colors outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                  Пароль
                </label>
                {isLogin && (
                  <div className="text-sm">
                    <a href="#" className="font-medium text-zinc-600 hover:text-zinc-900 underline decoration-zinc-400 underline-offset-4 transition-colors">
                      Забыли пароль?
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  className="block w-full pl-11 pr-3 py-3.5 border border-zinc-200 focus:ring-0 focus:border-zinc-500 sm:text-sm bg-zinc-50 text-zinc-900 transition-colors outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-all disabled:opacity-70 uppercase tracking-wider"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Подождите...
                </>
              ) : (
                <>
                  {isLogin ? 'Войти' : 'Зарегистрироваться'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <Suspense fallback={<div className="text-center py-10">Загрузка...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
