// app/auth/login/page.tsx
// Login page with email/password form

import Link from 'next/link'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
export default function LoginPage() {
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
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                minLength={6}
              />
            </div>
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
