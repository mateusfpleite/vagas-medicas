'use client'
import { useActionState } from 'react'
import { updatePassword, type ActionState } from '../actions'
import { AuthField } from '@/app/_components/AuthField'
import { SubmitButton } from '@/app/_components/SubmitButton'

export function NewPasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(updatePassword, {})
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthField label="Nova senha" name="password" type="password" required autoComplete="new-password" placeholder="mín. 8 caracteres" />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Salvar nova senha</SubmitButton>
    </form>
  )
}
