import Link from 'next/link'
import { SpecialtyCount } from '@/lib/types'
import { toSlug } from '@/lib/slugs'

export function SpecialtyPicks({ specialtyCounts }: { specialtyCounts: SpecialtyCount[] }) {
  if (specialtyCounts.length === 0) return null

  return (
    <section className="border-b border-cream-dark bg-white/60 py-6">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Especialidades mais procuradas
        </p>
        <div className="flex flex-wrap gap-2">
          {specialtyCounts.map((sc, i) => (
            <Link
              key={sc.specialty}
              href={`/especialidade/${toSlug(sc.specialty)}`}
              className="animate-fade-in inline-flex items-center gap-1.5 rounded-full bg-cream-dark/60 px-3.5 py-1.5 text-sm font-medium text-ink-light transition-all hover:bg-primary-light hover:text-primary-dark"
              style={{ animationDelay: `${300 + i * 40}ms` }}
            >
              {sc.specialty}
              <span className="text-xs text-ink-faint">
                {sc.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
