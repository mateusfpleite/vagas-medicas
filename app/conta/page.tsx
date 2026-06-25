import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { ProfileForm } from './ProfileForm'

export const metadata: Metadata = { title: 'Minha conta', robots: { index: false } }

export default async function ContaPage() {
  if (!isSupabaseConfigured()) redirect('/')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/entrar?next=/conta')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, crm, crm_uf, phone')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="font-[family-name:var(--font-serif)] text-2xl text-ink">Minha conta</h1>
      <p className="mt-1 mb-6 text-sm text-ink-muted">{user.email}</p>
      <ProfileForm profile={profile ?? {}} />
    </div>
  )
}
