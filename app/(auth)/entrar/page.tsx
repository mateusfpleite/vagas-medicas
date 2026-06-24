import type { Metadata } from 'next'
import { AuthShell } from '@/app/_components/AuthShell'
import { SignInForm } from './SignInForm'
import { safeNextPath } from '@/lib/auth/validation'

export const metadata: Metadata = { title: 'Entrar', robots: { index: false } }

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams
  const initialError =
    error === 'auth' ? 'O link expirou ou é inválido. Entre novamente.' : undefined
  return (
    <AuthShell title="Entrar" subtitle="Acesse sua conta de médico.">
      <SignInForm next={safeNextPath(next)} initialError={initialError} />
    </AuthShell>
  )
}
