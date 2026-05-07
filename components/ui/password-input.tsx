// components/ui/password-input.tsx
// Password input with show/hide toggle

'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface PasswordInputProps extends Omit<InputProps, 'type'> {
  toggleLabel?: string
}

export function PasswordInput({ className, toggleLabel = 'Afficher le mot de passe', ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('pr-10', className)}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={toggleLabel}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}
