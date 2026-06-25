import { describe, it, expect } from 'vitest'
import { validateEmail, validatePassword, safeNextPath, authErrorMessage } from './validation'

describe('validateEmail', () => {
  it('rejects empty', () => expect(validateEmail('')).toBeTruthy())
  it('rejects malformed', () => expect(validateEmail('foo@bar')).toBeTruthy())
  it('accepts valid', () => expect(validateEmail('dr@hospital.com.br')).toBeNull())
})

describe('validatePassword', () => {
  it('rejects empty', () => expect(validatePassword('')).toBeTruthy())
  it('rejects short', () => expect(validatePassword('1234567')).toBeTruthy())
  it('accepts >=8', () => expect(validatePassword('12345678')).toBeNull())
})

describe('safeNextPath', () => {
  it('allows internal path', () => expect(safeNextPath('/conta')).toBe('/conta'))
  it('allows path with query', () => expect(safeNextPath('/conta?tab=perfil')).toBe('/conta?tab=perfil'))
  it('blocks protocol-relative', () => expect(safeNextPath('//evil.com')).toBe(''))
  it('blocks absolute url', () => expect(safeNextPath('https://evil.com')).toBe(''))
  it('blocks empty/null', () => expect(safeNextPath(null)).toBe(''))
  // open-redirect bypasses: WHATWG URL treats backslash as slash for http(s)
  it('blocks backslash redirect', () => expect(safeNextPath('/\\evil.com')).toBe(''))
  it('blocks slash-backslash redirect', () => expect(safeNextPath('/\\/evil.com')).toBe(''))
  it('blocks CRLF/control chars', () => expect(safeNextPath('/\nhttp://evil.com')).toBe(''))
})

describe('authErrorMessage', () => {
  it('maps invalid creds', () =>
    expect(authErrorMessage({ code: 'invalid_credentials' })).toContain('incorret'))
  it('maps duplicate', () =>
    expect(authErrorMessage({ code: 'user_already_exists' })).toContain('cadastrado'))
  it('falls back', () =>
    expect(authErrorMessage({ message: 'weird' })).toBeTruthy())
  it('does not throw on null', () =>
    expect(authErrorMessage(null)).toBeTruthy())
})
