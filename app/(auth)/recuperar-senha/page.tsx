import type { Metadata } from 'next'
import { AuthShell } from '@/app/_components/AuthShell'
import { ResetRequestForm } from './ResetRequestForm'

export const metadata: Metadata = { title: 'Recuperar senha', robots: { index: false } }

export default function RecuperarSenhaPage() {
  return (
    <AuthShell title="Recuperar senha" subtitle="Enviaremos um link para redefinir sua senha.">
      <ResetRequestForm />
    </AuthShell>
  )
}
