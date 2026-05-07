// middleware.ts
// Protect authenticated routes (/dashboard)

import { createServerClient as createMiddlewareClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware to protect routes
 * 
 * Protected routes: /dashboard/*
 * Public routes: /, /auth/*, /products, /shop/*
 * 
 * Flow:
 * 1. Check if user is authenticated
 * 2. If accessing /dashboard and NOT authenticated → redirect to /auth/login
 * 3. Otherwise, allow request
 * 
 * Time to complete: 2min
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

  // Public routes: skip Supabase auth checks to avoid slowdowns/timeouts
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Fast check: Look for session cookie first
  const hasSessionCookie = request.cookies.has('sb-fuimqugdecmjgttseevk-auth-token')
  
  // If no session cookie, redirect immediately without Supabase call
  if (!hasSessionCookie) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client with cookie handling
  const supabase = createMiddlewareClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get user session (with fast-fail if cookie exists)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect if not authenticated and trying to access protected route
  if (isProtectedRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
