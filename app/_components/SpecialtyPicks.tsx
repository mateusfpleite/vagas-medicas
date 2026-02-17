'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SpecialtyCount } from '@/lib/types'

export function SpecialtyPicks({ specialtyCounts }: { specialtyCounts: SpecialtyCount[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSpecialty = searchParams.get('specialty')

  if (specialtyCounts.length === 0) return null

  function handleClick(specialty: string) {
    const sp = new URLSearchParams(searchParams.toString())
    if (sp.get('specialty') === specialty) {
      sp.delete('specialty')
    } else {
      sp.set('specialty', specialty)
    }
    sp.delete('page')
    router.push(`?${sp.toString()}`, { scroll: false })
  }

  return (
    <section className="border-b border-cream-dark bg-white/60 py-6">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Especialidades mais procuradas
        </p>
        <div className="flex flex-wrap gap-2">
          {specialtyCounts.map((sc, i) => {
            const isActive = activeSpecialty === sc.specialty
            return (
              <button
                key={sc.specialty}
                onClick={() => handleClick(sc.specialty)}
                className={`animate-fade-in inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-cream-dark/60 text-ink-light hover:bg-primary-light hover:text-primary-dark'
                }`}
                style={{ animationDelay: `${300 + i * 40}ms` }}
              >
                {sc.specialty}
                <span className={`text-xs ${isActive ? 'text-white/70' : 'text-ink-faint'}`}>
                  {sc.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
