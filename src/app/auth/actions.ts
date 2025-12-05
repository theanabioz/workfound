'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Собираем данные из формы
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Успех -> редирект на главную (а оттуда middleware или логика перекинет)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const role = formData.get('role') as 'employer' | 'seeker'

  // 1. Создаем пользователя в Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // 2. Важный хак: Триггер в БД создает профиль с ролью 'seeker'.
  // Если пользователь выбрал 'employer', нам нужно обновить его профиль И создать компанию.
  if (data.user && role === 'employer') {
    // Обновляем роль
    await supabase
      .from('profiles')
      .update({ role: 'employer' })
      .eq('id', data.user.id)

    // Создаем компанию
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({ name: `${fullName}'s Company` })
      .select()
      .single();
    
    if (!companyError && company) {
      // Делаем владельцем
      await supabase
        .from('company_members')
        .insert({
          company_id: company.id,
          user_id: data.user.id,
          role: 'owner'
        });
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
