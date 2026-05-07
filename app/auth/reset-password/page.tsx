// app/auth/reset-password/page.tsx
// Reset password page

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResetPasswordForm } from '@/components/features/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card variant="glass" className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Nouveau mot de passe</CardTitle>
          <CardDescription className="text-center">
            Choisissez un mot de passe sécurisé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata = {
  title: 'Réinitialiser le mot de passe - Mervason',
  description: 'Choisissez un nouveau mot de passe pour votre compte',
}
