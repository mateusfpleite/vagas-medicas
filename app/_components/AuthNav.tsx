'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export function AuthNav() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setEmail(session?.user?.email ?? null),
    )
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!isSupabaseConfigured()) return null

  async function handleSignOut() {
    await createClient().auth.signOut()
    setEmail(null)
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-3 px-6 py-3 text-xs">
      {email ? (
        <>
          <Link href="/conta" className="text-ink-muted hover:text-primary hover:underline">Minha conta</Link>
          <button onClick={handleSignOut} className="text-ink-muted hover:text-primary hover:underline">Sair</button>
        </>
      ) : (
        <Link href="/entrar" className="rounded-full border border-cream-dark px-3 py-1 text-ink-muted hover:border-primary hover:text-primary">
          Entrar
        </Link>
      )}
    </div>
  )
}
