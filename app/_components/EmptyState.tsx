'use client'

import { useRouter } from 'next/navigation'

export function EmptyState() {
  const router = useRouter()

  return (
    <div className="py-20 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-light">
        <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <p className="font-[family-name:var(--font-serif)] text-xl text-ink">
        Nenhuma vaga encontrada
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        Tente ajustar os filtros ou termos de busca.
      </p>
      <button
        onClick={() => router.push('/')}
        className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Limpar filtros
      </button>
    </div>
  )
}
