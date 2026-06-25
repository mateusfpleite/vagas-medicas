import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { AuthShell } from '@/app/_components/AuthShell'
import { NewPasswordForm } from './NewPasswordForm'

export const metadata: Metadata = { title: 'Definir nova senha', robots: { index: false } }

export default async function RedefinirSenhaPage() {
  if (!isSupabaseConfigured()) redirect('/')
  // Reached via the recovery link, which establishes a session through
  // /auth/confirm. Guard server-side so a logged-out direct visit is bounced
  // (consistent with /conta) rather than rendering a dead form.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/entrar')

  return (
    <AuthShell title="Definir nova senha" subtitle="Escolha uma nova senha para sua conta.">
      <NewPasswordForm />
    </AuthShell>
  )
}
