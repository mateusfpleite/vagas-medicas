'use client'
import { useActionState } from 'react'
import Link from 'next/link'
import { requestPasswordReset, type ActionState } from '../actions'
import { AuthField } from '@/app/_components/AuthField'
import { SubmitButton } from '@/app/_components/SubmitButton'

export function ResetRequestForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(requestPasswordReset, {})
  if (state.message) return <p className="text-sm text-ink">{state.message}</p>
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthField label="E-mail" name="email" type="email" required autoComplete="email" />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Enviar link de redefinição</SubmitButton>
      <p className="text-center text-xs text-ink-muted">
        Lembrou a senha? <Link href="/entrar" className="hover:text-primary hover:underline">Entrar</Link>
      </p>
    </form>
  )
}
