import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = {
              ...options,
              sameSite: 'none' as const,
              secure: true,
            }
            supabaseResponse.cookies.set(name, value, cookieOptions)
          })
        },
      },
    }
  )

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  // Check if trying to access protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/post-job')) {
    if (!user) {
      console.log('Middleware: No user found for path', request.nextUrl.pathname, 'Error:', error?.message);
      console.log('Cookies present:', request.cookies.getAll().map(c => c.name));
      
      // Make sure we pass the cookies if we redirect, just in case setAll cleared them
      const redirectUrl = new URL('/login', request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      
      // Copy cookies from supabaseResponse to redirectResponse
      supabaseResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      
      return redirectResponse;
    }

    // Role-based redirect
    const role = user.user_metadata?.role || 'seeker'
    if (request.nextUrl.pathname.startsWith('/dashboard/employer') && role !== 'employer') {
      return NextResponse.redirect(new URL('/dashboard/seeker', request.url))
    }
    if (request.nextUrl.pathname.startsWith('/dashboard/seeker') && role !== 'seeker') {
      return NextResponse.redirect(new URL('/dashboard/employer', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
