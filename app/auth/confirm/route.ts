import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { safeNextPath } from '@/lib/auth/validation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = safeNextPath(searchParams.get('next')) || '/conta'

  if (token_hash && type) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.verifyOtp({ type, token_hash })
      if (!error) return NextResponse.redirect(new URL(next, request.url))
    } catch {
      // fall through to the error redirect
    }
  }
  return NextResponse.redirect(new URL('/entrar?error=auth', request.url))
}
