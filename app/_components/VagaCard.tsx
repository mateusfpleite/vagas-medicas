'use client'

import { useState } from 'react'
import { Vaga } from '@/lib/types'
import { formatSalary } from '@/lib/utils'
import { FreshnessTag } from './FreshnessTag'
import { SourceBadge } from './SourceBadge'

const SOURCE_BORDER: Record<string, string> = {
  indeed: 'border-l-source-indeed',
  vagas_com: 'border-l-source-vagas',
  bne: 'border-l-source-bne',
  infojobs: 'border-l-source-infojobs',
}

export function VagaCard({ vaga, index }: { vaga: Vaga; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const salary = formatSalary(vaga)
  const borderColor = SOURCE_BORDER[vaga.source] ?? 'border-l-ink-muted'

  return (
    <article
      className={`animate-slide-up group rounded-lg border border-cream-dark/80 border-l-[3px] ${borderColor} bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div
        className="cursor-pointer px-5 py-4"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="font-[family-name:var(--font-serif)] text-[1.1rem] font-semibold leading-snug text-ink">
              {vaga.title}
            </h2>
            <p className="mt-0.5 text-[0.8rem] text-ink-muted">
              {vaga.company ?? 'Confidencial'}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <FreshnessTag date={vaga.effective_date} />
            <svg
              className={`h-4 w-4 text-ink-muted/40 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[0.78rem]">
          {(vaga.city || vaga.state) && (
            <span className="flex items-center gap-1 text-ink-light">
              <svg className="h-3.5 w-3.5 text-ink-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {[vaga.city, vaga.state].filter(Boolean).join(', ')}
            </span>
          )}

          {salary && (
            <span className="rounded-md bg-salary-light px-2 py-0.5 font-medium text-salary">
              {salary}
            </span>
          )}

          {vaga.specialty && (
            <span className="rounded-md bg-primary-light px-2 py-0.5 font-medium text-primary">
              {vaga.specialty}
            </span>
          )}

          <SourceBadge source={vaga.source} />
        </div>
      </div>

      {/* Expandable content with CSS Grid transition */}
      <div
        className="card-expand-grid"
        data-expanded={expanded}
      >
        <div>
          <div className="border-t border-cream-dark/60 px-5 py-4">
            {vaga.description && (
              <p className="text-[0.82rem] leading-relaxed text-ink-light whitespace-pre-line">
                {vaga.description.length > 500
                  ? vaga.description.slice(0, 500) + '...'
                  : vaga.description}
              </p>
            )}

            {vaga.benefits && vaga.benefits.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {vaga.benefits.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-accent-light px-2.5 py-0.5 text-[0.72rem] font-medium text-accent"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-end">
              <a
                href={vaga.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[0.8rem] font-medium text-white transition-colors hover:bg-primary-dark"
                onClick={(e) => e.stopPropagation()}
              >
                Ver vaga
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
