import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchVagas, fetchFilterOptions, fetchCountByState } from '@/lib/queries'
import { UFS } from '@/lib/constants'
import { VagaList } from '@/app/_components/VagaList'
import { Breadcrumbs, breadcrumbJsonLd } from '@/app/_components/Breadcrumbs'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://empregamed.com.br'

type Props = {
  params: Promise<{ uf: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

export const revalidate = 3600

function resolveStateName(uf: string): string | null {
  const entry = UFS.find((u) => u.sigla.toLowerCase() === uf.toLowerCase())
  return entry?.nome ?? null
}

function resolveStateSigla(uf: string): string | null {
  const entry = UFS.find((u) => u.sigla.toLowerCase() === uf.toLowerCase())
  return entry?.sigla ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uf } = await params
  const sigla = resolveStateSigla(uf)
  const nome = resolveStateName(uf)
  if (!sigla || !nome) return {}

  const count = await fetchCountByState(sigla)
  const title = `Vagas Médicas em ${nome}`
  const description = `${count} vagas médicas em ${nome} (${sigla}) agregadas de Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos.`

  return {
    title,
    description,
    alternates: { canonical: `/estado/${uf.toLowerCase()}` },
    openGraph: {
      title: `${title} | EmpregaMed`,
      description,
      url: `${BASE_URL}/estado/${uf.toLowerCase()}`,
    },
  }
}

export default async function StatePage({ params, searchParams }: Props) {
  const { uf } = await params
  const sp = await searchParams
  const sigla = resolveStateSigla(uf)
  const nome = resolveStateName(uf)
  if (!sigla || !nome) notFound()

  const page = sp.page ? Number(sp.page) : undefined
  const { vagas, count } = await fetchVagas({
    state: sigla,
    specialty: sp.specialty,
    city: sp.city ? sp.city.split(',') : undefined,
    q: sp.q,
    page,
  })
  const { specialties, cities, states } = await fetchFilterOptions({ state: sigla })

  const crumbs = [
    { label: 'Início', href: '/' },
    { label: nome },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
      />
      <section className="border-b border-cream-dark bg-gradient-to-b from-white to-cream">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Breadcrumbs crumbs={crumbs} />
          <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-ink sm:text-4xl">
            Vagas Médicas em {nome}
          </h1>
          <p className="mt-2 text-ink-muted">
            {count} {count === 1 ? 'vaga encontrada' : 'vagas encontradas'} em {nome} ({sigla}).
          </p>
        </div>
      </section>
      <VagaList
        initialVagas={vagas}
        initialCount={count}
        specialties={specialties}
        cities={cities}
        states={states}
      />
    </>
  )
}
