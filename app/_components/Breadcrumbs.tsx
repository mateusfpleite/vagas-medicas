import Link from 'next/link'

type Crumb = {
  label: string
  href?: string
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-[0.78rem] text-ink-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-primary hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-ink-light">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://empregamed.com.br'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs
      .filter((c) => c.href)
      .map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.label,
        item: `${BASE_URL}${crumb.href}`,
      })),
  }
}
