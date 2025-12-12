import Link from 'next/link';
import { acceptInvitation } from '@/lib/supabase-service';
import { CheckCircle, XCircle } from 'lucide-react';

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  
  const result = await acceptInvitation(token);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md w-full text-center">
        
        {result.success ? (
          <>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Добро пожаловать!</h1>
            <p className="text-gray-600 mb-8">
              Вы успешно присоединились к команде <strong>{result.companyName}</strong>.
            </p>
            <Link 
              href="/employer/dashboard"
              className="block w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Перейти в панель управления
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ошибка</h1>
            <p className="text-gray-600 mb-8">
              {result.error === 'Not authenticated' 
                ? 'Пожалуйста, войдите в аккаунт или зарегистрируйтесь, чтобы принять приглашение.'
                : result.error
              }
            </p>
            
            {result.error === 'Not authenticated' ? (
              <div className="space-y-3">
                <Link 
                  href={`/login?next=/invite/${token}`}
                  className="block w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Войти
                </Link>
                <Link 
                  href={`/register?next=/invite/${token}`}
                  className="block w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Зарегистрироваться
                </Link>
              </div>
            ) : (
              <Link 
                href="/"
                className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                На главную
              </Link>
            )}
          </>
        )}

      </div>
    </div>
  );
}
