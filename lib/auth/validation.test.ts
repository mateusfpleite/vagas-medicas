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
  it('blocks protocol-relative', () => expect(safeNextPath('//evil.com')).toBe(''))
  it('blocks absolute url', () => expect(safeNextPath('https://evil.com')).toBe(''))
  it('blocks empty/null', () => expect(safeNextPath(null)).toBe(''))
})

describe('authErrorMessage', () => {
  it('maps invalid creds', () =>
    expect(authErrorMessage({ code: 'invalid_credentials' })).toContain('incorret'))
  it('maps duplicate', () =>
    expect(authErrorMessage({ code: 'user_already_exists' })).toContain('cadastrado'))
  it('falls back', () =>
    expect(authErrorMessage({ message: 'weird' })).toBeTruthy())
})
