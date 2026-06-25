-- Security hardening (from the RLS audit): lock the base `vagas` table and the
-- `vagas_public` view away from the public `anon` role.
--
-- Why: the publishable/anon key is fully public, and the previous
-- `vagas_select_public` policy used USING (true), letting anyone read the base
-- table directly via PostgREST — including raw_html (868 populated rows) and
-- internal crawler columns. The frontend reads vaga data via the privileged
-- pooler connection (role `postgres`), NOT via the anon key, so removing anon
-- access has zero impact on the site.
--
-- If a public/anon read API for vagas is ever wanted, re-expose ONLY a curated
-- view (security definer) to anon — never the base table.

-- Drop the permissive anon SELECT policy on the base table.
drop policy if exists vagas_select_public on public.vagas;

-- Remove the Supabase-default table grants for anon (the base table and the view).
revoke all on public.vagas        from anon;
revoke all on public.vagas_public from anon;
