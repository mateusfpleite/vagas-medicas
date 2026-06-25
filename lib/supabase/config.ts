export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
// Supabase's new publishable key (sb_publishable_...) — the drop-in successor to
// the legacy anon JWT key. Same low privileges; RLS behaves identically.
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''

/** True only when both public Supabase envs are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)
}
