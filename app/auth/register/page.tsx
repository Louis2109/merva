// app/auth/register/page.tsx
// Registration page with email/password/names form

import Link from 'next/link'
import { register } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Register Page
 * 
 * Features:
 * - Email/password/names form
 * - Server Action submission
 * - Auto-creates profile via database trigger
 * - Redirects to dashboard after signup
 * 
 * Time to complete: 3min
 */
interface RegisterPageProps {
  searchParams?: Promise<{ error?: string }>
}

function getMessage(error?: string) {
  switch (error) {
    case 'invalid':
      return { type: 'error', text: 'Email invalide ou mot de passe trop court (min 8).' }
    case 'signup':
      return { type: 'error', text: 'Impossible de créer le compte. Réessayez.' }
    default:
      return null
  }
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const message = getMessage(params?.error)
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card variant="glass" className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Créer un compte</CardTitle>
          <CardDescription className="text-center">
            Commencez à vendre sur Mervason dès aujourd'hui
          </CardDescription>
        </CardHeader>

        <form action={register}>
          <CardContent className="space-y-4">
            {/* Name Fields (Grid) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Jean"
                  required
                  autoComplete="given-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Dupont"
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@exemple.com"
                required
                autoComplete="email"
              />
              <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                ⓘ Utilisez un email réel. Vous recevrez un lien de confirmation.
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                minLength={8}
              />
              <p className="text-xs text-gray-500">
                Minimum 8 caractères
              </p>
            </div>

            {message && (
              <div
                className={`rounded-lg border px-3 py-2 text-sm ${
                  message.type === 'error'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-green-200 bg-green-50 text-green-700'
                }`}
              >
                {message.text}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            {/* Submit Button */}
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Créer mon compte
            </Button>

            {/* Login Link */}
            <p className="text-sm text-center text-gray-600">
              Vous avez déjà un compte?{' '}
              <Link href="/auth/login" className="text-orange-500 hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export const metadata = {
  title: 'Inscription - Mervason',
  description: 'Créez votre compte vendeur Mervason',
}
