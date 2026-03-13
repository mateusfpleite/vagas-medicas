import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { fetchVagas, fetchFilterOptions, fetchAllSpecialties } from '@/lib/queries'
import { toSlug } from '@/lib/slugs'
import { UFS } from '@/lib/constants'
import { VagaList } from '@/app/_components/VagaList'
import { Breadcrumbs, breadcrumbJsonLd } from '@/app/_components/Breadcrumbs'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://empregamed.com.br'

type Props = {
  params: Promise<{ slug: string; uf: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

export const revalidate = 3600

async function resolveSpecialty(slug: string): Promise<string | null> {
  const specialties = await fetchAllSpecialties()
  return specialties.find((s) => toSlug(s) === slug) ?? null
}

function resolveUf(uf: string) {
  const entry = UFS.find((u) => u.sigla.toLowerCase() === uf.toLowerCase())
  return entry ? { sigla: entry.sigla, nome: entry.nome } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, uf } = await params
  const specialty = await resolveSpecialty(slug)
  const ufData = resolveUf(uf)
  if (!specialty || !ufData) return {}

  const { count } = await fetchVagas({ specialty, state: ufData.sigla })
  const title = `Vagas de ${specialty} em ${ufData.nome}`
  const description = `${count} vagas de ${specialty} em ${ufData.nome} (${ufData.sigla}). Agregadas de Indeed, BNE, Vagas.com, InfoJobs e PCI Concursos.`

  return {
    title,
    description,
    alternates: { canonical: `/especialidade/${slug}/${uf.toLowerCase()}` },
    openGraph: {
      title: `${title} | EmpregaMed`,
      description,
      url: `${BASE_URL}/especialidade/${slug}/${uf.toLowerCase()}`,
    },
  }
}

export default async function SpecialtyStatePage({ params, searchParams }: Props) {
  const { slug, uf } = await params
  const sp = await searchParams
  const specialty = await resolveSpecialty(slug)
  const ufData = resolveUf(uf)
  if (!specialty || !ufData) notFound()

  const page = sp.page ? Number(sp.page) : undefined
  const { vagas, count } = await fetchVagas({ specialty, state: ufData.sigla, page })
  const { specialties, cities, states } = await fetchFilterOptions({ state: ufData.sigla })

  if (count === 0) notFound()

  const crumbs = [
    { label: 'Inicio', href: '/' },
    { label: specialty, href: `/especialidade/${slug}` },
    { label: ufData.nome },
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
            Vagas de {specialty} em {ufData.nome}
          </h1>
          <p className="mt-2 text-ink-muted">
            {count} {count === 1 ? 'vaga encontrada' : 'vagas encontradas'}.
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
