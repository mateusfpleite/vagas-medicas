'use client'
import { useActionState } from 'react'
import { updateProfile, type ActionState } from '@/app/(auth)/actions'
import { AuthField } from '@/app/_components/AuthField'
import { SubmitButton } from '@/app/_components/SubmitButton'

type Profile = { full_name?: string | null; crm?: string | null; crm_uf?: string | null; phone?: string | null }

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateProfile, {})
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthField label="Nome completo" name="full_name" defaultValue={profile.full_name ?? ''} autoComplete="name" />
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <AuthField label="CRM" name="crm" defaultValue={profile.crm ?? ''} />
        </div>
        <AuthField label="UF" name="crm_uf" defaultValue={profile.crm_uf ?? ''} placeholder="SP" />
      </div>
      <AuthField label="Telefone / WhatsApp" name="phone" type="tel" defaultValue={profile.phone ?? ''} autoComplete="tel" />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.message && <p className="text-sm text-fresh">{state.message}</p>}
      <SubmitButton>Salvar</SubmitButton>
    </form>
  )
}
