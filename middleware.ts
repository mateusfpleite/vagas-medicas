import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // Only the protected area needs session handling. The public site (homepage,
  // /especialidade/*, /estado/*, /sobre) is static/client-auth, so running
  // getUser() there would add a Supabase round-trip per request for nothing.
  matcher: ['/conta/:path*'],
}
