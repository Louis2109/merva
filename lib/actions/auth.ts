// lib/actions/auth.ts
// Server Actions for authentication (login, register, logout)

'use server'

import { createServerClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Register new user with email/password
 * 
 * Flow:
 * 1. Supabase creates auth.users entry
 * 2. Database trigger auto-creates profiles entry
 * 3. Redirect to dashboard
 * 
 * @param formData - Contains email, password, first_name, last_name
 */
export async function register(formData: FormData) {
  const supabase = await createServerClient()

  // Extract form data
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('first_name') as string
  const lastName = formData.get('last_name') as string

  // Validation (basic)
  if (!email || !password || password.length < 6) {
    console.error('Invalid email or password (min 6 characters)')
    redirect('/auth/register?error=invalid')
  }

  // Sign up user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Signup error:', error.message)
    redirect('/auth/register?error=signup')
  }

  // Update profile with names (trigger already created empty profile)
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq('id', data.user.id)

    if (profileError) {
      console.error('Profile update failed:', profileError)
    }
  }

  // Revalidate and redirect
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Login existing user
 * 
 * @param formData - Contains email, password
 */
export async function login(formData: FormData) {
  const supabase = await createServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    console.error('Email and password required')
    redirect('/auth/login?error=required')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    redirect('/auth/login?error=invalid')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', (await supabase.auth.getUser()).data.user?.id || '')
    .single()

  revalidatePath('/', 'layout')
  
  // Redirect to /admin if admin, /dashboard otherwise
  if (profile?.is_admin) {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}

/**
 * Logout current user
 */
export async function logout() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
