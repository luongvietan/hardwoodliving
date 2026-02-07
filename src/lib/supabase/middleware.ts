import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication (trade user or admin)
const PROTECTED_ROUTES = ['/trades/dashboard', '/leads', '/api/export']

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!supabaseAnonKey) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Refreshes expired auth tokens and stores them to cookies
  const { data: { user } } = await supabase.auth.getUser()

  // Route protection: redirect unauthenticated users away from protected routes
  const { pathname } = request.nextUrl
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isProtectedRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/trades/login'
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from login/register pages to dashboard
  const isAuthRoute = pathname === '/trades/login' || pathname === '/trades/register'
  if (isAuthRoute && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/trades/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}
