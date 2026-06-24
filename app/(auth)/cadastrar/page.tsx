import type { Metadata } from 'next'
import { AuthShell } from '@/app/_components/AuthShell'
import { SignUpForm } from './SignUpForm'

export const metadata: Metadata = { title: 'Criar conta', robots: { index: false } }

export default function CadastrarPage() {
  return (
    <AuthShell title="Criar conta" subtitle="Para médicos. Leva menos de um minuto.">
      <SignUpForm />
    </AuthShell>
  )
}
