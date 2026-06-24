'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  authErrorMessage,
  safeNextPath,
  validateEmail,
  validatePassword,
} from '@/lib/auth/validation'

export type ActionState = { error?: string; message?: string }

async function siteUrl(): Promise<string> {
  // Prefer the build-time-pinned canonical origin. Never trust client-supplied
  // headers (Origin / Host / X-Forwarded-Host) for links that get emailed to
  // users — host-header injection would otherwise point confirm/reset links at
  // an attacker-controlled origin. The header path is a local-dev fallback only.
  const base = process.env.NEXT_PUBLIC_BASE_URL
  if (base) return base
  const h = await headers()
  const host = h.get('host')
  if (host) return `http://${host}`
  return 'http://localhost:3000'
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = safeNextPath(String(formData.get('next') ?? ''))

  const emailErr = validateEmail(email)
  if (emailErr) return { error: emailErr }
  if (!password) return { error: 'Informe sua senha.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: authErrorMessage(error) }

  revalidatePath('/', 'layout')
  redirect(next || '/conta')
}

export async function signUp(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const fullName = String(formData.get('full_name') ?? '').trim()

  const emailErr = validateEmail(email)
  if (emailErr) return { error: emailErr }
  const pwErr = validatePassword(password)
  if (pwErr) return { error: pwErr }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || null },
      emailRedirectTo: `${await siteUrl()}/auth/confirm?next=/conta`,
    },
  })
  if (error) return { error: authErrorMessage(error) }

  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/conta')
  }
  return {
    message: 'Conta criada! Enviamos um link de confirmação para o seu e-mail.',
  }
}

export async function requestPasswordReset(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const emailErr = validateEmail(email)
  if (emailErr) return { error: emailErr }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await siteUrl()}/auth/confirm?next=/redefinir-senha`,
  })
  if (error) return { error: authErrorMessage(error) }
  return { message: 'Se houver uma conta com esse e-mail, enviamos um link de redefinição.' }
}

export async function updatePassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get('password') ?? '')
  const pwErr = validatePassword(password)
  if (pwErr) return { error: pwErr }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: authErrorMessage(error) }

  revalidatePath('/', 'layout')
  redirect('/conta')
}

export async function updateProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Sessão expirada. Entre novamente.' }

  const payload = {
    full_name: String(formData.get('full_name') ?? '').trim() || null,
    crm: String(formData.get('crm') ?? '').trim() || null,
    crm_uf: String(formData.get('crm_uf') ?? '').trim().toUpperCase() || null,
    phone: String(formData.get('phone') ?? '').trim() || null,
  }

  // upsert (not update): a plain UPDATE of 0 rows succeeds silently for any user
  // without a pre-existing profile row. upsert relies on the profiles_insert_own
  // policy (already in the migration). The new-user trigger normally pre-creates
  // the row, so this is the robust path for both cases.
  const { error } = await supabase.from('profiles').upsert({ id: user.id, ...payload })
  if (error) return { error: 'Não foi possível salvar. Tente novamente.' }

  revalidatePath('/conta')
  return { message: 'Perfil atualizado.' }
}
