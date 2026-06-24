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

/** Only allow internal absolute paths; block open redirects. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return ''
  return next
}

type AuthErrorLike = { message?: string; code?: string; status?: number }

export function authErrorMessage(error: AuthErrorLike): string {
  const code = error.code ?? ''
  const msg = (error.message ?? '').toLowerCase()
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
