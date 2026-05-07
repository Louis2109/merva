// app/auth/forgot-password/page.tsx
// Forgot password page

import { forgotPassword } from '@/lib/actions/auth'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ForgotPasswordPageProps {
  searchParams?: Promise<{ error?: string; success?: string }>
}

function getMessage(error?: string, success?: string) {
  if (success) {
    return { type: 'success', text: 'Email envoyé. Vérifiez votre boîte de réception.' }
  }

  switch (error) {
    case 'required':
      return { type: 'error', text: 'Veuillez saisir votre email.' }
    case 'invalid':
      return { type: 'error', text: 'Email invalide. Vérifiez votre saisie.' }
    case 'send_failed':
      return { type: 'error', text: 'Impossible d\'envoyer l\'email. Réessayez.' }
    default:
      return null
  }
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams
  const message = getMessage(params?.error, params?.success)

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card variant="glass" className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Mot de passe oublié</CardTitle>
          <CardDescription className="text-center">
            Entrez votre email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>

        <form action={forgotPassword}>
          <CardContent className="space-y-4">
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
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Envoyer le lien
            </Button>
            <p className="text-sm text-center text-gray-600">
              Vous vous souvenez ?{' '}
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
  title: 'Mot de passe oublié - Mervason',
  description: 'Réinitialisez votre mot de passe Mervason',
}
