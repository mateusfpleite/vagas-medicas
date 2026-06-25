# Auth Setup & Operator Runbook

Doctor authentication for EmpregaMed, built on **Supabase Auth** (email + password)
with an auto-provisioned `profiles` table and a protected `/conta` page.

The code is **deployable as-is**: every Supabase entry point is guarded by
`isSupabaseConfigured()`, so with no publishable key the public site is completely
unchanged and the auth UI simply doesn't appear. The steps below light it up.

---

## 1. Required environment variables

| Variable | Value | Where |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xbpiwfyctoslazrnzxsd.supabase.co` | `.env.local` + Vercel |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | the project **publishable** key (`sb_publishable_…`) | `.env.local` + Vercel |
| `NEXT_PUBLIC_BASE_URL` | `https://empregamed.com.br` | Vercel (prod/preview) |

- Get the publishable key from **Supabase dashboard → Project Settings → API Keys →
  Publishable key** (format `sb_publishable_…`). It is the current successor to the
  legacy `anon` JWT key (same low privileges, RLS behaves identically) and is safe to
  ship to the browser. The legacy `anon` key still works but is being deprecated —
  prefer the publishable key. If your dashboard only shows the legacy keys, click
  **Create new API keys** first.
- `NEXT_PUBLIC_BASE_URL` is the canonical origin used to build the confirm/reset
  links that get emailed to users. It **must** be set in production — the auth
  code deliberately does **not** trust request `Host`/`Origin` headers for those
  links (host-header-injection defense). Locally it falls back to the dev host.
- The `service_role` key is **not needed** for this feature (the DB trigger
  provisions profiles and RLS governs access).

> **NEXT_PUBLIC_* vars are inlined at build time.** After adding/changing them in
> Vercel you must **redeploy** for them to take effect. Add them to Production,
> Preview, and Development.

---

## 2. Supabase dashboard configuration (one-time, manual)

### 2a. URL configuration
**Authentication → URL Configuration**
- **Site URL:** `https://empregamed.com.br`
- **Redirect URLs:** add `http://localhost:3000/**` and `https://empregamed.com.br/**`

### 2b. Email templates — **CRITICAL, do not skip**
The app confirms email links via the PKCE route `/auth/confirm`, which needs a
`token_hash` + `type`. Supabase's **default** templates use `{{ .ConfirmationURL }}`
(implicit flow) and will **not** carry `token_hash` to our route — confirm and
password-reset would silently fail. Edit **Authentication → Email Templates**:

- **Confirm signup** → link href:
  ```
  {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/conta
  ```
- **Reset Password** → link href:
  ```
  {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/redefinir-senha
  ```

### 2c. Optional — local testing
For frictionless local dev you can disable **Confirm email**
(Authentication → Providers → Email). The signup code handles both modes:
confirmation on → "check your email" message; off → immediate login.

---

## 3. Database

Two migrations are **already applied** to the shared Supabase Postgres:
- `supabase/migrations/0001_profiles.sql` — creates `public.profiles` (1:1 with
  `auth.users`), enables RLS (a user can only read/write their own row), and installs
  the `on_auth_user_created` trigger that auto-creates a profile row on signup.
- `supabase/migrations/0002_lock_vagas.sql` — security hardening from the RLS audit:
  removes public `anon` access to the base `vagas` table and `vagas_public` view
  (they exposed `raw_html` + internal columns). The frontend reads vagas via the
  privileged pooler connection, so this is transparent to the site.

To re-apply elsewhere (idempotent):
```bash
DBURL=$(grep '^DATABASE_URL=' ../.env | cut -d= -f2-)   # from repo root .env
psql "$DBURL" -v ON_ERROR_STOP=1 -f supabase/migrations/0001_profiles.sql
psql "$DBURL" -v ON_ERROR_STOP=1 -f supabase/migrations/0002_lock_vagas.sql
```

---

## 4. Manual E2E checklist

After the publishable key is set and the app is deployed/running, verify:

1. **Sign up** at `/cadastrar` → receive confirmation email → click link → land on `/conta`.
2. **Log in** at `/entrar` → redirected to `/conta`.
3. **Edit profile** on `/conta` (name, CRM, UF, phone) → "Perfil atualizado."
4. In the DB, confirm a `public.profiles` row exists for the user with the saved fields.
5. **Sign out** via the header (`Sair`) → header shows `Entrar` again.
6. **Password reset:** `/recuperar-senha` → email → link → `/redefinir-senha` → set new password → `/conta`.
7. **Guard:** visit `/conta` while logged out → redirected to `/entrar?next=/conta`.
8. **Regression:** the homepage, `/especialidade/*`, `/estado/*`, `/sobre` look and behave exactly as before.

---

## 5. Known notes / future work

- **Google OAuth is deferred.** The PKCE callback route (`/auth/callback`) and the
  client are already OAuth-ready. To enable: create a Google OAuth client in Google
  Cloud, configure it under Supabase → Authentication → Providers → Google, then add
  a "Continuar com Google" button calling
  `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '<site>/auth/callback?next=/conta' } })`.
- **`middleware.ts` deprecation.** Next.js 16.1.6 emits a build warning that the
  `middleware` file convention is deprecated in favor of `proxy`. It still works and
  is fully supported in the 16.x line; rename `middleware.ts` → `proxy.ts` (same
  exported function) when convenient, before upgrading to a Next major that removes it.
- **Member-only features** (personalized filters/recommendations, email/WhatsApp job
  alerts) are intentionally **out of scope** here — this builds only the auth +
  profile foundation. The `phone` profile field exists to seed future WhatsApp alerts.
