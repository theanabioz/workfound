import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  if (!supabaseUrl || !supabaseKey) {
    console.error('Middleware Error: Supabase keys are missing. Check Vercel Env Vars.');
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Получаем пользователя
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 2. Правила для НЕ авторизованных пользователей
  if (!user) {
    // Если пытаются зайти в защищенные разделы
    if (path.startsWith('/employer') || path.startsWith('/seeker') || path.startsWith('/admin')) {
      const url = request.nextUrl.clone()
      if (path.startsWith('/admin')) {
         // Админку скрываем полностью (404), чтобы не палить контору
         url.pathname = '/404'
         return NextResponse.rewrite(url)
      }
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    // Для остальных страниц ничего не делаем
    return response
  }

  // 3. Правила для АВТОРИЗОВАННЫХ пользователей
  if (user) {
    // Если авторизован и пытается зайти на страницу входа/регистрации -> редирект в кабинет
    if (path === '/login' || path === '/register') {
      // Нам нужно узнать роль, чтобы понять, куда редиректить
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      const url = request.nextUrl.clone()
      if (profile?.role === 'employer') {
        url.pathname = '/employer/dashboard'
      } else {
        url.pathname = '/seeker/dashboard'
      }
      return NextResponse.redirect(url)
    }

    // Проверка прав доступа к разделам (RBAC)
    if (path.startsWith('/employer') || path.startsWith('/seeker')) {
      // Получаем роль (этот запрос к БД быстрый)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = profile?.role

      // Если Соискатель лезет к Работодателям
      if (path.startsWith('/employer') && role !== 'employer') {
        const url = request.nextUrl.clone()
        url.pathname = '/seeker/dashboard'
        return NextResponse.redirect(url)
      }

      // Если Работодатель лезет к Соискателям
      if (path.startsWith('/seeker') && role === 'employer') {
         const url = request.nextUrl.clone()
         url.pathname = '/employer/dashboard'
         return NextResponse.redirect(url)
      }

      // ADMIN PROTECTION
      if (path.startsWith('/admin')) {
        if (role !== 'admin') {
          // Для обычных смертных этой страницы не существует (404)
          // Мы делаем rewrite на несуществующую страницу, чтобы Next.js показал 404
          const url = request.nextUrl.clone()
          url.pathname = '/404' 
          return NextResponse.rewrite(url)
        }
      }
    }
  }

  return response
}