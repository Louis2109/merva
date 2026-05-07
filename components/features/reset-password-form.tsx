// components/features/reset-password-form.tsx
// Client form for resetting password with Supabase

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const MIN_PASSWORD_LENGTH = 8

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error_param = searchParams.get('error')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    // Check if there's an error from Supabase (e.g., otp_expired)
    if (error_param) {
      setError('Lien invalide ou expiré. Veuillez refaire la demande.')
    }
  }, [error_param])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`)
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setIsSubmitting(true)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    setIsSubmitting(false)

    if (updateError) {
      setError('Impossible de mettre à jour le mot de passe. Réessayez.')
      return
    }

    setSuccess('Mot de passe mis à jour. Vous pouvez vous connecter.')
    router.push('/auth/login?reset=success')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-xs text-gray-500">Minimum {MIN_PASSWORD_LENGTH} caractères</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirmer le mot de passe</Label>
        <PasswordInput
          id="confirm_password"
          name="confirm_password"
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {success}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
      </Button>
    </form>
  )
}
