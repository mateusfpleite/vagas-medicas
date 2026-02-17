'use client'

import { useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Vaga } from '@/lib/types'
import { VagaCard } from './VagaCard'
import { FilterBar } from './FilterBar'
import { Pagination } from './Pagination'
import { EmptyState } from './EmptyState'
import { LoadingSkeleton } from './LoadingSkeleton'

const PAGE_SIZE = 20

type Props = {
  initialVagas: Vaga[]
  initialCount: number
  specialties: string[]
  cities: string[]
  states: string[]
}

export function VagaList({
  initialVagas,
  initialCount,
  specialties,
  cities,
  states,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const specialty = searchParams.get('specialty') ?? null
  const cityParam = searchParams.get('city') ?? ''
  const state = searchParams.get('state') ?? null
  const q = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  const city = cityParam ? cityParam.split(',') : []
  const totalPages = Math.ceil(initialCount / PAGE_SIZE)
  const hasFilters = specialty || cityParam || state || q

  const updateURL = useCallback(
    (params: Record<string, string | null>) => {
      const sp = new URLSearchParams(searchParams.toString())
      Object.entries(params).forEach(([k, v]) => {
        if (v) sp.set(k, v)
        else sp.delete(k)
      })
      if (!('page' in params)) sp.delete('page')
      startTransition(() => {
        router.push(`?${sp.toString()}`, { scroll: false })
      })
    },
    [router, searchParams],
  )

  return (
    <div className="mx-auto max-w-5xl px-6">
      <FilterBar
        specialties={specialties}
        cities={cities}
        states={states}
        specialty={specialty}
        city={city}
        state={state}
        q={q}
        onSpecialtyChange={(v) => updateURL({ specialty: v })}
        onCityChange={(v) => updateURL({ city: v.length > 0 ? v.join(',') : null })}
        onStateChange={(v) => updateURL({ state: v, city: null })}
        onSearchChange={(v) => updateURL({ q: v || null })}
      />

      <div className="mt-6 mb-4 flex items-baseline justify-between">
        <p className="text-[0.82rem] text-ink-muted">
          <span className="font-semibold tabular-nums text-ink">{initialCount.toLocaleString('pt-BR')}</span>{' '}
          {initialCount === 1 ? 'vaga encontrada' : 'vagas encontradas'}
          {hasFilters && (
            <button
              onClick={() => router.push('/')}
              className="ml-2 cursor-pointer text-primary hover:text-primary-dark"
            >
              Limpar filtros
            </button>
          )}
        </p>
      </div>

      {isPending ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {initialVagas.length === 0 ? (
              <EmptyState />
            ) : (
              initialVagas.map((vaga, i) => (
                <VagaCard key={vaga.id} vaga={vaga} index={i} />
              ))
            )}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => updateURL({ page: String(p) })}
          />
        </>
      )}
    </div>
  )
}
