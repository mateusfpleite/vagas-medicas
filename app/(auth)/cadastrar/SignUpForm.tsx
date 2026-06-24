'use client'
import { useActionState } from 'react'
import Link from 'next/link'
import { signUp, type ActionState } from '../actions'
import { AuthField } from '@/app/_components/AuthField'
import { SubmitButton } from '@/app/_components/SubmitButton'

export function SignUpForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(signUp, {})
  if (state.message) return <p className="text-sm text-ink">{state.message}</p>
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthField label="Nome completo" name="full_name" autoComplete="name" />
      <AuthField label="E-mail" name="email" type="email" required autoComplete="email" />
      <AuthField label="Senha" name="password" type="password" required autoComplete="new-password" placeholder="mín. 8 caracteres" />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Criar conta</SubmitButton>
      <p className="text-center text-xs text-ink-muted">
        Já tem conta? <Link href="/entrar" className="hover:text-primary hover:underline">Entrar</Link>
      </p>
    </form>
  )
}
