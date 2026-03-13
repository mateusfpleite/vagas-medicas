import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchVagas, fetchFilterOptions, fetchCitiesByState } from '@/lib/queries'
import { UFS } from '@/lib/constants'
import { toSlug } from '@/lib/slugs'
import { VagaList } from '@/app/_components/VagaList'
import { Breadcrumbs, breadcrumbJsonLd } from '@/app/_components/Breadcrumbs'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://empregamed.com.br'

type Props = {
  params: Promise<{ uf: string; cidade: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

export const revalidate = 3600

function resolveUf(uf: string) {
  const entry = UFS.find((u) => u.sigla.toLowerCase() === uf.toLowerCase())
  return entry ? { sigla: entry.sigla, nome: entry.nome } : null
}

async function resolveCity(state: string, cidadeSlug: string): Promise<string | null> {
  const cities = await fetchCitiesByState(state)
  return cities.find((c) => toSlug(c) === cidadeSlug) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uf, cidade } = await params
  const ufData = resolveUf(uf)
  if (!ufData) return {}

  const city = await resolveCity(ufData.sigla, cidade)
  if (!city) return {}

  const { count } = await fetchVagas({ state: ufData.sigla, city: [city] })
  const title = `Vagas Medicas em ${city} - ${ufData.sigla}`
  const description = `${count} vagas medicas em ${city}, ${ufData.nome}. Agregadas de Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos.`

  return {
    title,
    description,
    alternates: { canonical: `/estado/${uf.toLowerCase()}/${cidade}` },
    openGraph: {
      title: `${title} | EmpregaMed`,
      description,
      url: `${BASE_URL}/estado/${uf.toLowerCase()}/${cidade}`,
    },
  }
}

export default async function CityPage({ params, searchParams }: Props) {
  const { uf, cidade } = await params
  const sp = await searchParams
  const ufData = resolveUf(uf)
  if (!ufData) notFound()

  const city = await resolveCity(ufData.sigla, cidade)
  if (!city) notFound()

  const page = sp.page ? Number(sp.page) : undefined
  const { vagas, count } = await fetchVagas({ state: ufData.sigla, city: [city], page })
  const { specialties, cities, states } = await fetchFilterOptions({ state: ufData.sigla })

  const crumbs = [
    { label: 'Inicio', href: '/' },
    { label: ufData.nome, href: `/estado/${uf.toLowerCase()}` },
    { label: city },
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
            Vagas Medicas em {city}
          </h1>
          <p className="mt-2 text-ink-muted">
            {count} {count === 1 ? 'vaga encontrada' : 'vagas encontradas'} em {city}, {ufData.nome}.
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
