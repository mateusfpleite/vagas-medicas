import Link from 'next/link'
import { UFS } from '@/lib/constants'

type StateCount = { state: string; count: number }

export function PopularStates({ stateCounts }: { stateCounts: StateCount[] }) {
  if (stateCounts.length === 0) return null

  return (
    <section className="border-b border-cream-dark py-6">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Estados com mais vagas
        </p>
        <div className="flex flex-wrap gap-2">
          {stateCounts.map((sc, i) => {
            const uf = UFS.find((u) => u.sigla === sc.state)
            return (
              <Link
                key={sc.state}
                href={`/estado/${sc.state.toLowerCase()}`}
                className="animate-fade-in inline-flex items-center gap-1.5 rounded-full bg-cream-dark/60 px-3.5 py-1.5 text-sm font-medium text-ink-light transition-all hover:bg-primary-light hover:text-primary-dark"
                style={{ animationDelay: `${300 + i * 40}ms` }}
              >
                {uf?.nome ?? sc.state}
                <span className="text-xs text-ink-faint">
                  {sc.count}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
