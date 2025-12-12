'use client'

import Link from 'next/link'
import { resetPassword } from '@/app/auth/actions'
import { useState } from 'react'
import { Briefcase, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    const result = await resetPassword(formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2 group mb-6">
          <div className="bg-black text-white p-2 rounded-lg">
             <Briefcase className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl text-gray-900">Workfound</span>
        </Link>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Сброс пароля
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          {success ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Проверьте почту</h3>
              <p className="text-gray-500 text-sm mb-6">
                Мы отправили ссылку для восстановления пароля.
              </p>
              <Link href="/login" className="text-black font-medium hover:underline">
                Вернуться ко входу
              </Link>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email адрес
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Отправка...' : 'Сбросить пароль'}
                </button>
              </div>
              
              <div className="text-center">
                <Link href="/login" className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-black">
                  <ArrowLeft className="w-3 h-3" /> Назад ко входу
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
