import type { Metadata } from 'next'
import { AuthShell } from '@/app/_components/AuthShell'
import { NewPasswordForm } from './NewPasswordForm'

export const metadata: Metadata = { title: 'Definir nova senha', robots: { index: false } }

export default function RedefinirSenhaPage() {
  return (
    <AuthShell title="Definir nova senha" subtitle="Escolha uma nova senha para sua conta.">
      <NewPasswordForm />
    </AuthShell>
  )
}
