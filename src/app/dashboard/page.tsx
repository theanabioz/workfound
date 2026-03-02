import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { WorkerDashboard } from '@/components/dashboard/worker/WorkerDashboard'
import { EmployerDashboard } from '@/components/dashboard/employer/EmployerDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Получаем роль пользователя из нашей таблицы profiles
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    // Если профиль не найден (что странно при наличии user), 
    // можно отправить на завершение регистрации или логаут
    console.error('Profile not found:', error)
    return <div>Ошибка загрузки профиля. Пожалуйста, обратитесь в поддержку.</div>
  }

  return (
    <main>
      {profile.role === 'EMPLOYER' ? (
        <EmployerDashboard profile={profile} />
      ) : (
        <WorkerDashboard profile={profile} />
      )}
    </main>
  )
}
