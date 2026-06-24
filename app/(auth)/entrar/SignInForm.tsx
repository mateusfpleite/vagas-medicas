'use client'
import { useActionState } from 'react'
import Link from 'next/link'
import { signIn, type ActionState } from '../actions'
import { AuthField } from '@/app/_components/AuthField'
import { SubmitButton } from '@/app/_components/SubmitButton'

export function SignInForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(signIn, {})
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <AuthField label="E-mail" name="email" type="email" required autoComplete="email" />
      <AuthField label="Senha" name="password" type="password" required autoComplete="current-password" />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>Entrar</SubmitButton>
      <div className="flex justify-between text-xs text-ink-muted">
        <Link href="/recuperar-senha" className="hover:text-primary hover:underline">Esqueci a senha</Link>
        <Link href="/cadastrar" className="hover:text-primary hover:underline">Criar conta</Link>
      </div>
    </form>
  )
}
