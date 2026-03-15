'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Helper to translate common Supabase errors
function translateError(errorMsg: string) {
  if (errorMsg.includes('Invalid login credentials')) return 'Неверный email или пароль';
  if (errorMsg.includes('Email not confirmed')) return 'Пожалуйста, подтвердите ваш email. Письмо отправлено на вашу почту.';
  if (errorMsg.includes('User already registered')) return 'Пользователь с таким email уже существует';
  if (errorMsg.includes('Password should be at least')) return 'Пароль должен содержать минимум 6 символов';
  return errorMsg;
}

export async function login(formData: FormData) {
  let role = 'seeker';
  try {
    const supabase = await createClient()

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      return { error: translateError(error.message) }
    }
    
    role = authData.user?.user_metadata?.role || 'seeker'
  } catch (err: any) {
    console.error('Login error:', err)
    return { error: 'Внутренняя ошибка сервера при входе' }
  }

  revalidatePath('/', 'layout')
  redirect(`/dashboard/${role}`)
}

export async function signup(formData: FormData) {
  let role = 'seeker';
  let requiresEmailConfirmation = false;
  try {
    const supabase = await createClient()

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      options: {
        data: {
          role: formData.get('role') as string,
          name: formData.get('name') as string,
        }
      }
    }

    const { data: authData, error } = await supabase.auth.signUp(data)

    if (error) {
      return { error: translateError(error.message) }
    }

    // If Supabase requires email confirmation, session will be null
    if (!authData.session) {
      requiresEmailConfirmation = true;
    } else {
      role = formData.get('role') as string || 'seeker'
    }
  } catch (err: any) {
    console.error('Signup error:', err)
    return { error: 'Внутренняя ошибка сервера при регистрации' }
  }

  if (requiresEmailConfirmation) {
    return { 
      error: 'Регистрация успешна! Пожалуйста, проверьте вашу почту и подтвердите email для входа.',
      success: false 
    }
  }

  revalidatePath('/', 'layout')
  redirect(`/dashboard/${role}`)
}

export async function signout() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
  } catch (err) {
    console.error('Signout error:', err)
  }
  redirect('/')
}
