// app/auth/login/page.tsx
// Login page with email/password form

import Link from 'next/link'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Login Page
 * 
 * Features:
 * - Email/password form
 * - Server Action submission (no JS required)
 * - Link to register page
 * - Glassmorphism card design
 * 
 * Time to complete: 2min
 */
interface LoginPageProps {
  searchParams?: Promise<{ error?: string; reset?: string }>
}

function getMessage(error?: string, reset?: string) {
  if (reset === 'success') {
    return { type: 'success', text: 'Mot de passe mis à jour. Vous pouvez vous connecter.' }
  }

  switch (error) {
    case 'required':
      return { type: 'error', text: 'Email et mot de passe requis.' }
    case 'invalid':
      return { type: 'error', text: 'Email ou mot de passe incorrect.' }
    default:
      return null
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const message = getMessage(params?.error, params?.reset)
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card variant="glass" className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Bon retour</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte Mervason
          </CardDescription>
        </CardHeader>

        <form action={login}>
          <CardContent className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="test@exemple.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                minLength={8}
              />
            </div>

            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-sm text-orange-500 hover:underline font-medium">
                Mot de passe oublié ?
              </Link>
            </div>

            {message && (
              <div
                className={`rounded-lg border px-3 py-2 text-sm ${
                  message.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {/* Submit Button */}
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Se connecter
            </Button>

            {/* Register Link */}
            <p className="text-sm text-center text-gray-600">
              Pas encore de compte?{' '}
              <Link href="/auth/register" className="text-orange-500 hover:underline font-medium">
                S'inscrire
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export const metadata = {
  title: 'Connexion - Mervason',
  description: 'Connectez-vous à votre compte Mervason',
}
