export function validateEmail(email: string): string | null {
  if (!email) return 'Informe seu e-mail.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'E-mail inválido.'
  return null
}

export function validatePassword(pw: string): string | null {
  if (!pw) return 'Informe uma senha.'
  if (pw.length < 8) return 'A senha deve ter ao menos 8 caracteres.'
  return null
}

/** True if the string contains any ASCII control char (incl. CR/LF/tab) or DEL. */
function hasControlChar(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    if (c < 0x20 || c === 0x7f) return true
  }
  return false
}

/**
 * Only allow internal absolute paths; block open redirects.
 *
 * Rejects protocol-relative (`//host`), backslash tricks (`/\host`, `/\/host` —
 * the WHATWG URL parser treats `\` as `/` for http(s), so these resolve
 * cross-origin), and control/whitespace chars. Anything that survives is
 * resolved against a fixed dummy origin and only returned if the origin is
 * unchanged — so a malicious target can never escape same-origin.
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return ''
  if (hasControlChar(next)) return ''
  try {
    const u = new URL(next, 'http://localhost')
    return u.origin === 'http://localhost' ? u.pathname + u.search + u.hash : ''
  } catch {
    return ''
  }
}

type AuthErrorLike = { message?: string; code?: string; status?: number }

export function authErrorMessage(error: AuthErrorLike | null | undefined): string {
  const code = error?.code ?? ''
  const msg = (error?.message ?? '').toLowerCase()
  if (code === 'invalid_credentials' || msg.includes('invalid login'))
    return 'E-mail ou senha incorretos.'
  if (code === 'user_already_exists' || msg.includes('already registered'))
    return 'Este e-mail já está cadastrado.'
  if (code === 'weak_password') return 'Senha muito fraca. Use ao menos 8 caracteres.'
  if (code === 'email_not_confirmed' || msg.includes('not confirmed'))
    return 'Confirme seu e-mail antes de entrar.'
  if (code.includes('rate_limit') || msg.includes('rate limit'))
    return 'Muitas tentativas. Tente novamente em alguns minutos.'
  return 'Algo deu errado. Tente novamente.'
}
